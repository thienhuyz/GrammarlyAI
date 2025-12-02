import axios from '../axios'

export const apiRegister = (data) => axios({
    url: '/user/register',
    method: 'post',
    data,
});

export const apiVerifyOTP = (data) => axios({
    url: '/user/verify-otp',
    method: 'post',
    data,
});


export const apiResendOTP = (data) => axios({
    url: '/user/resend-otp',
    method: 'post',
    data,
});

export const apiLogin = (data) => axios({
    url: '/user/login',
    method: 'post',
    data
});

export const apiForgotPassword = (data) => axios({
    url: '/user/forgotpassword',
    method: 'post',
    data
})

export const apiResetPassword = (data) => axios({
    url: '/user/resetpassword',
    method: 'put',
    data
})

export const apiGetCurrent = () => axios({
    url: '/user/current',
    method: 'get',
})
export const apiLogout = () => axios({
    url: '/user/logout',
    method: 'get',
});

export const apiUpdateErrorStats = (data) => axios({
    url: '/user/error-stats',
    method: 'put',
    data,
});

export const apiUpdateCurrent = (data) => axios({
    url: '/user/current',
    method: 'put',
    data,
});

export const apiAdminGetUsers = (params) =>
    axios({
        url: '/user/admin/users',
        method: 'get',
        params,
    });

export const apiAdminUpdateUser = (uid, data) =>
    axios({
        url: `/user/admin/users/${uid}`,
        method: 'put',
        data,
    });

export const apiAdminDeleteUser = (uid) =>
    axios({
        url: `/user/admin/users/${uid}`,
        method: 'delete',
    });