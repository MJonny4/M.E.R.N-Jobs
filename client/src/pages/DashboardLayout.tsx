import Wrapper from "../assets/wrappers/Dashboard";
import { Outlet, redirect, useNavigate, useNavigation } from "react-router-dom";
import { BigSidebar, Navbar, SmallSidebar } from "../components";
import { useState, createContext, useContext, useEffect } from "react";
import { checkDefaultTheme } from "../App";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";
import Loading from "../components/Loading";
import { useQuery } from "@tanstack/react-query";

const userQuery = {
    queryKey: ["user"],
    queryFn: async () => {
        const response = await customFetch.get("/users/current-user");
        return response.data;
    },
};

export const loader = (queryClient) => async () => {
    try {
        return await queryClient.ensureQueryData(userQuery);
    } catch (error) {
        return redirect("/login");
    }
};

const DashboardContext = createContext(null);

const DashboardLayout = ({ queryClient }) => {
    const { user } = useQuery(userQuery).data;
    const navigate = useNavigate();

    const navigation = useNavigation();
    const isPageLoading = navigation.state === "loading";

    const [showSidebar, setShowSidebar] = useState(false);
    const [isDarkTheme, setIsDarkTheme] = useState(checkDefaultTheme);
    const [isAuthError, setIsAuthError] = useState(false);

    const toggleDarkTheme = () => {
        const newDarkTheme = !isDarkTheme;
        setIsDarkTheme(newDarkTheme);
        document.body.classList.toggle("dark-theme", newDarkTheme);
        localStorage.setItem("darkTheme", String(newDarkTheme));
    };

    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };

    const logoutUser = async () => {
        await customFetch.get("/auth/logout");
        queryClient.invalidateQueries();
        navigate("/login");
        toast.success("Logged out...");
    };

    customFetch.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            if (error?.response?.status === 401) {
                setIsAuthError(true);
            }
            return Promise.reject(error);
        }
    );

    useEffect(() => {
        if (!isAuthError) return;
        logoutUser();
    }, [isAuthError]);

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
