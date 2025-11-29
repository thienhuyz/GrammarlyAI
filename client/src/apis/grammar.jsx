import axios from '../axios'

export const apiCheckGrammar = (data) =>
    axios({
        url: '/grammar/check',
        method: 'post',
        data,
    });
export const apiUploadDoc = (file) => {
    const formData = new FormData();
    formData.append("file", file);

    return axios({
        url: "/grammar/upload",
        method: "post",
        data: formData,
    });
};
