import axios from "axios";
import backendUrl from "../../config";
import Cookies from "js-cookie";
import {isTokenExpired, refreshToken} from "../init";

const api = axios.create({
    baseURL: `${backendUrl}`,
    headers: {
        "Content-Type": "application/json",
    },
});

const getAttachmentsByMessageId = async (messageId) => {
    const authToken = JSON.parse(atob(Cookies.get('token'))).access_token;
    if (isTokenExpired(authToken)) {
        console.log("Token expired, refreshing...");
        refreshToken();
    }
    try {
        const response = await api.get(`/attachments/message/${messageId}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(atob(Cookies.get('token'))).access_token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw new Error("Error fetching attachments");
    }
};

const uploadAttachment = async (attachment) => {
    const authToken = JSON.parse(atob(Cookies.get('token'))).access_token;
    if (isTokenExpired(authToken)) {
        console.log("Token expired, refreshing...");
        refreshToken();
    }
    try {
        const response = await api.post("/attachments/upload", attachment, {
            headers: {
                Authorization: `Bearer ${JSON.parse(atob(Cookies.get('token'))).access_token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw new Error("Error uploading attachment");
    }
};

const AttachmentsAPI = {
    getAttachmentsByMessageId,
    uploadAttachment,
};

export default AttachmentsAPI;
