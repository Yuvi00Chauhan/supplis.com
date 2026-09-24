import {repository} from '@loopback/repository';
import {get, param, HttpErrors} from '@loopback/rest';
import {
  RoleRepository,
  UserRepository,
  UserTenantRepository,
} from '@sourceloop/authentication-service';

export class UserInfoController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(UserTenantRepository)
    public userTenantRepository: UserTenantRepository,
    @repository(RoleRepository)
    public roleRepository: RoleRepository,
  ) {}

  @get('/auth/userinfo')
  async getUserInfo(
    @param.header.string('Authorization') authHeader?: string,
  ): Promise<any> {
    return this.getUserProfile(authHeader);
  }

  @get('/auth/me')
  async getMe(
    @param.header.string('Authorization') authHeader?: string,
  ): Promise<any> {
    return this.getUserProfile(authHeader);
  }

  private async getUserProfile(authHeader?: string): Promise<any> {
    if (!authHeader) {
      throw new HttpErrors.Unauthorized('Authorization header is required.');
    }

    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    if (!token) {
      throw new HttpErrors.Unauthorized('Bearer token is missing.');
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new HttpErrors.Unauthorized('Invalid token format.');
    }

    let payload: any;
    try {
      const decodedJson = Buffer.from(parts[1], 'base64url').toString('utf8');
      payload = JSON.parse(decodedJson);
    } catch (e) {
      throw new HttpErrors.Unauthorized('Unable to parse token payload.');
    }

    // Check expiration if present
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      throw new HttpErrors.Unauthorized('Token has expired.');
    }

    const userId = payload.userId || payload.id || payload.sub;
    const username = payload.username || payload.authId || payload.name;
    const email = payload.email;

    let user: any = null;

    if (userId) {
      try {
        user = await this.userRepository.findById(userId);
      } catch (err) {
        // Fallback to searching by username or email
      }
    }

    if (!user && (username || email)) {
      const searchConditions: any[] = [];
      if (username) {
        searchConditions.push({username: String(username).toLowerCase()});
        searchConditions.push({email: String(username).toLowerCase()});
      }
      if (email) {
        searchConditions.push({email: String(email).toLowerCase()});
      }

      user = await this.userRepository.findOne({
        where: {
          or: searchConditions,
        },
      });
    }

    if (user) {
      const userTenant = user.id
        ? await this.userTenantRepository.findOne({where: {userId: user.id}})
        : undefined;
      const role = userTenant?.roleId
        ? await this.roleRepository.findById(userTenant.roleId)
        : undefined;
      const displayName =
        [user.firstName, user.lastName].filter(Boolean).join(' ') ||
        user.username ||
        'User';

      return {
        id: user.id,
        username: user.username,
        firstName: user.firstName || user.username,
        lastName: user.lastName || '',
        name: displayName,
        email: user.email,
        phone: user.phone || '+91 98765 43210',
        rewardPoints: 450,
        role: role?.name || 'User',
        roles: role?.name ? [role.name] : ['User'],
      };
    }

    // If user not found in DB but token payload contains info, return fallback
    if (username || email) {
      const displayName = payload.firstName || payload.name || username || email;
      return {
        id: userId || 'user_id',
        username: username || email,
        firstName: payload.firstName || username || 'User',
        lastName: payload.lastName || '',
        name: displayName,
        email: email || `${username}@example.com`,
        phone: payload.phone || '+91 98765 43210',
        rewardPoints: 450,
        role: payload.role || 'User',
        roles: Array.isArray(payload.roles)
          ? payload.roles
          : [payload.role || 'User'],
      };
    }

    throw new HttpErrors.Unauthorized('User profile not found.');
  }
}
