import axios from 'axios';

const instance = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URI || "http://localhost:5000/api",
    withCredentials: true,
});

// Add a request interceptor
instance.interceptors.request.use(
    function (config) {

        const rawData = window.localStorage.getItem('persist:ai/user');
        if (!rawData) return config;
        const localStorageData = JSON.parse(rawData);

        const tokenString = localStorageData?.token;
        if (!tokenString) return config;

        const accessToken = JSON.parse(tokenString);
        if (!accessToken) return config;

        config.headers = {
            ...(config.headers || {}),
            authorization: `Bearer ${accessToken}`,
        };
        // console.log(config)
        return config;

    },
    function (error) {
        // Do something with request error
        return Promise.reject(error);
    }
);


// Add a response interceptor
instance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    // console.log(response)
    return response.data;
}, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return error.response.data;
});

export default instance;