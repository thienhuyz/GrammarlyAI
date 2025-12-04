import axios from "../axios";

export const apiSaveWritingHistory = (data) =>
    axios({
        url: "/history",
        method: "post",
        data,
    });

export const apiGetWritingHistory = (params) =>
    axios({
        url: "/history",
        method: "get",
        params,
    });
