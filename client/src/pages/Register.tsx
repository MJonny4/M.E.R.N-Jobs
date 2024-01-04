import { Form, redirect, Link } from "react-router-dom";
import Wrapper from "../assets/wrappers/RegisterAndLoginPage";
import Logo from "../components/Logo";
import FormRow from "../components/FormRow";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";
import { SubmitBtn } from "../components";

export const action = async ({ request }) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    try {
        await customFetch.post("/auth/register", data);
        toast.success("Account created successfully!");
        return redirect("/login");
    } catch (error) {
        toast.error(error?.response?.data?.msg || error.msg);
        return error;
    }
};

const Register = () => {
    return (
        <Wrapper>
            <Form className="form" method="post" action="">
                <Logo />
                <h4>Register</h4>
                <FormRow type="text" name="name" />
                <FormRow type="text" name="lastName" labelText={"Last Name"} />
                <FormRow type="text" name="location" />
                <FormRow type="email" name="email" />
                <FormRow type="password" name="password" />
                <SubmitBtn />
                <p>
                    Already a member?
                    <Link to="/login" className="member-btn">
                        Login
                    </Link>
                </p>
            </Form>
        </Wrapper>
    );
};
export default Register;
