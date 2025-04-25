import axios from "axios";

export const commonApi = async (method, url, reqBody, reqHeader = {"Content-Type": "application/json"}) => {
    const config = {
        method,
        url,
        data: reqBody,
        headers: reqHeader,
    };

    try {
        const result = await axios(config);
        return { success: true, data: result.data, status: result.status };
    } catch (error) {
        return {
            success: false,
            error: error.response ? error.response.data : error.message,
            status: error.response ? error.response.status : 500,
        };
    }
};
