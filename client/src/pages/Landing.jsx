import main from "../assets/images/main.svg";
import { Link } from "react-router-dom";
import logo from "../assets/images/logo.svg";
import Wrapper from "../assets/wrappers/LandingPage";

const Landing = () => {
    return (
        <Wrapper>
            <nav>
                <img src={logo} alt="jobify" className="logo" />
            </nav>
            <div className="container page">
                {/* info */}
                <div className="info">
                    <h1>
                        job <span>tracking</span> app
                    </h1>
                    <p>
                        I am baby wayfarers hoodie next level taiyaki brooklyn
                        cliche blue bottle single-origin coffee chia. Aesthetic
                        post-ironic venmo, quinoa lo-fi tote bag adaptogen
                        everyday carry meggings +1 brunch narwhal.
                    </p>
                    <Link to="/register" className="btn register-link">
                        Register
                    </Link>
                    <Link to="/login" className="btn">
                        Login / Demo User
                    </Link>
                </div>
                <img src={main} alt="job hunt" className="img main-img" />
            </div>
        </Wrapper>
    );
};

export default Landing;
