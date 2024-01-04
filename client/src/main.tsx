import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import { ToastContainer } from "react-toastify";
/* import customFetch from "./utils/customFetch.js";

const response = await customFetch.get("/test");
console.log(response.data); */

ReactDOM.createRoot(document.getElementById("root")).render(
    <>
        <App />
        <ToastContainer position="top-center" />
    </>
);
