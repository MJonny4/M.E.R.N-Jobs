import { Link, useRouteError } from "react-router-dom";
import Wrapper from "../assets/wrappers/ErrorPage";
import img from "../assets/images/not-found.svg";

const Error = () => {
    const error = useRouteError();

    if ((error as { status: number }).status === 404) {
        return (
            <Wrapper>
                <div>
                    <img src={img} alt="not found" />
                    <h3>Oh! page not found</h3>
                    <p>
                        We are sorry, but the page you requested was not found
                    </p>
                    <Link to="/">Go Home</Link>
                </div>
            </Wrapper>
        );
    } else {
        return (
            <Wrapper>
                <div>
                    <h3>An error has ocurred</h3>
                    <Link to="/">Go Home</Link>
                </div>
            </Wrapper>
        );
    }
};
export default Error;
