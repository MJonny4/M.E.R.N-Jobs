import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import {
    HomeLayout,
    Landing,
    Register,
    Login,
    DashboardLayout,
    Error,
    AddJob,
    Stats,
    AllJobs,
    Profile,
    Admin,
    EditJob,
} from "./pages";

import { action as registerAction } from "./pages/Register";
import { action as loginAction } from "./pages/Login";
import { action as addJobAction } from "./pages/AddJob";
import { loader as dashboardLoader } from "./pages/DashboardLayout";
import { loader as jobLoader } from "./pages/AllJobs";
import { loader as editJobLoader } from "./pages/EditJob";
import { action as editJobAction } from "./pages/EditJob";
import { action as deleteJobAction } from "./pages/DeleteJob";
import { loader as adminLoader } from "./pages/Admin";
import { action as profileAction } from "./pages/Profile";
import { loader as statsLoader } from "./pages/Stats";
import ErrorElement from "./components/ErrorElement";

export const checkDefaultTheme = () => {
    const isDarkTheme = localStorage.getItem("darkTheme") === "true";
    document.body.classList.toggle("dark-theme", isDarkTheme);
    return isDarkTheme;
};

checkDefaultTheme();

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            staleTime: 1000 * 60 * 5,
        },
    },
});

const router = createBrowserRouter([
    {
        path: "/",
        element: <HomeLayout />,
        errorElement: <Error />,
        children: [
            {
                index: true,
                element: <Landing />,
            },
            {
                path: "register",
                element: <Register />,
                action: registerAction,
            },
            {
                path: "login",
                element: <Login />,
                action: loginAction(queryClient)
            },
            {
                path: "dashboard",
                element: <DashboardLayout queryClient={queryClient}/>,
                loader: dashboardLoader(queryClient),
                children: [
                    {
                        index: true,
                        element: <AddJob />,
                        action: addJobAction(queryClient),
                        errorElement: <ErrorElement />
                    },
                    {
                        path: "stats",
                        element: <Stats />,
                        loader: statsLoader(queryClient),
                        errorElement: <ErrorElement />
                    },
                    {
                        path: "all-jobs",
                        element: <AllJobs />,
                        loader: jobLoader(queryClient),
                        errorElement: <ErrorElement />
                    },
                    {
                        path: "profile",
                        element: <Profile />,
                        action: profileAction(queryClient),
                        errorElement: <ErrorElement />
                    },
                    {
                        path: "admin",
                        element: <Admin />,
                        loader: adminLoader,
                        errorElement: <ErrorElement />
                    },
                    {
                        path: "edit-job/:id",
                        element: <EditJob />,
                        loader: editJobLoader,
                        action: editJobAction(queryClient),
                        errorElement: <ErrorElement />
                    },
                    {
                        path: "delete-job/:id",
                        action: deleteJobAction(queryClient),
                        errorElement: <ErrorElement />
                    },
                ],
            },
        ],
    },
]);

const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />;
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
};



export default App;
