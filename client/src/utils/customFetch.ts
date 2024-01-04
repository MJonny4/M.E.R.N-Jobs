import axios from "axios";

/* BaseUrl will be the endpoint because I already writed the full url in vite.config.js */
/**
 * Creates an instance of axios with a base URL of "/api/v1".
 * @type {import("axios").AxiosInstance}
 */
const customFetch = axios.create({
    baseURL: "/api/v1",
});

export default customFetch;
