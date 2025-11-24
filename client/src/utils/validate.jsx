export const isValidEmail = (email) => {
    const regex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return regex.test(email);
};

export const isValidPhone = (phone) => {
    const regex = /^(0[3|5|7|8|9])[0-9]{8}$/;
    return regex.test(phone);
};

export const isValidPassword = (password) => {
    return typeof password === "string" && password.length >= 6;
};
