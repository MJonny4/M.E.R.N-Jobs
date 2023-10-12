import { Logo, FormRow, SubmitBtn } from "../components";
import Wrapper from "../assets/wrappers/RegisterAndLoginPage";
import {
    Link,
    Form,
    redirect,
    useActionData,
    useNavigate,
} from "react-router-dom";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";

export const action = async ({ request }) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    /* Optional */
    /* const errors = {msg: ""};
    if (data.password.length < 8) {
        errors.msg = "Password must be at least 8 characters long mf!";
        return errors;
    } */

    try {
        await customFetch.post("/auth/login", data);
        toast.success("Logged in successfully!");
        return redirect("/dashboard");
    } catch (error) {
        toast.error(error?.response?.data?.msg || error.msg);
        return error;
    }
};

const Login = () => {
    /* const errors = useActionData(); */
    const navigate = useNavigate();

    const loginTestUser = async () => {
        const data = {
            email: "test@test.com",
            password: "secret123",
        };

        try {
            await customFetch.post("/auth/login", data);
            toast.success("Test user logged in successfully!");
            navigate("/dashboard");
        } catch (error) {
            toast.error(error?.response?.data?.msg || error.msg);
        }
    };

    return (
        <Wrapper>
            <Form className="form" method="post" action="">
                <Logo />
                <h4>Login</h4>
                {/* <p
                    style={{
                        color: "red",
                        textAlign: "center",
                        fontSize: "1.2rem",
                        fontWeight: "bold",
                    }}
                >
                    {errors?.msg}
                </p> */}
                <FormRow type="email" name="email" />
                <FormRow type="password" name="password" />
                <SubmitBtn />
                <button
                    type="button"
                    className="btn btn-block"
                    onClick={loginTestUser}
                >
                    Explore the App
                </button>
                <p>
                    Don&apos;t have an account? &nbsp;
                    <Link to="/register">Register</Link>
                </p>
            </Form>
        </Wrapper>
    );
};
export default Login;
