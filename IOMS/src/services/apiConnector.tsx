import axios from "axios";

const axiosInstance = axios.create({});

const apiConnector = (
    method: string,
    url: string,
    bodyData: object | undefined,
    headers?: object,
    params?: object
) => {
    return axiosInstance({
        method: method,
        url: url,
        data: bodyData,
        headers: headers,
        params: params,
    });
};

export default apiConnector;
