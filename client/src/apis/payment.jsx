import axios from '../axios';

export const apiCreateMoMoPayment = (amount) =>
    axios({
        url: '/payment/momo',
        method: 'post',
        data: { amount }
    });
