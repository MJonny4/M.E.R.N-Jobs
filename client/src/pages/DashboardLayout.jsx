/* eslint-disable react/prop-types */
import Wrapper from "../assets/wrappers/Dashboard";
import {
    Outlet,
    redirect,
    useLoaderData,
    useNavigate,
    useNavigation,
} from "react-router-dom";
import { BigSidebar, Navbar, SmallSidebar } from "../components";
import { useState, createContext, useContext } from "react";
import { checkDefaultTheme } from "../App";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";
import Loading from "../components/Loading";

export const loader = async () => {
    try {
        const { data } = await customFetch.get("/users/current-user");
        return data;
    } catch (error) {
        return redirect("/login");
    }
};

const DashboardContext = createContext();

const DashboardLayout = () => {
    const { user } = useLoaderData();
    const navigate = useNavigate();

    const navigation = useNavigation();
    const isPageLoading = navigation.state === "loading";

    const [showSidebar, setShowSidebar] = useState(false);
    const [isDarkTheme, setIsDarkTheme] = useState(checkDefaultTheme);

    const toggleDarkTheme = () => {
        const newDarkTheme = !isDarkTheme;
        setIsDarkTheme(newDarkTheme);
        document.body.classList.toggle("dark-theme", newDarkTheme);
        localStorage.setItem("darkTheme", newDarkTheme);
    };

    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };

    const logoutUser = async () => {
        await customFetch.get("/auth/logout");
        navigate("/login");
        toast.success("Logged out...");
    };

    return (
        <DashboardContext.Provider
            value={{
                user,
                showSidebar,
                isDarkTheme,
                toggleDarkTheme,
                toggleSidebar,
                logoutUser,
            }}
        >
            <Wrapper>
                <main className="dashboard">
                    <SmallSidebar />
                    <BigSidebar />
                    <div>
                        <Navbar />
                        <div className="dashboard-page">
                            {isPageLoading ? (
                                <Loading />
                            ) : (
                                <Outlet
                                    context={{
                                        user,
                                    }}
                                />
                            )}
                        </div>
                    </div>
                </main>
            </Wrapper>
        </DashboardContext.Provider>
    );
};

export const useDashboardContext = () => useContext(DashboardContext);
export default DashboardLayout;
