import "../css/Footer.css";
import { useNavigate } from "react-router-dom";
function Footer() {
    const navigate = useNavigate();
    const goToAbout = () => {
        navigate("/about"); // Navigates to the About page
    };
    const goToHome = () => {
        navigate("/");
    };
    const goToFeatures = () => {
        navigate("/features");
    };
    const goToFAQs = () => {
        navigate("/faqs");
    };

    return (
        <footer className="d-flex flex-wrap justify-content-between align-items-center py-2 border-top footer">
            <div className="company">
                <p className="col-md-4 mb-0 text-white">&copy; {new Date().getFullYear()} Suplis.com Inc</p>
            </div>

            <ul className="nav col-md-4 justify-content-end">
                <li className="nav-item">
                    <a href="#home"  className="nav-link px-2 text-white" onClick={goToHome}>
                        Home
                    </a>
                </li>
                <li className="nav-item">
                    <a  href="#home" className="nav-link px-2 text-white" onClick={goToFeatures}>
                        Features
                    </a>
                </li>
                <li className="nav-item">
                    <a  href="#home" className="nav-link px-2 text-white" onClick={goToFAQs}>
                        FAQs
                    </a>
                </li>
                <li className="nav-item">
                    <a href="#home" className="nav-link px-2 text-white" onClick={goToAbout}>
                        About
                    </a>
                </li>
            </ul>
        </footer>
    );
}
export default Footer;