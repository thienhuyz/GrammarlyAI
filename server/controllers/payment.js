const asyncHandler = require('express-async-handler');
const crypto = require('crypto');
const axios = require('axios');
const User = require('../models/user');

const MOMO_PARTNER_CODE = process.env.MOMO_PARTNER_CODE;
const MOMO_ACCESS_KEY = process.env.MOMO_ACCESS_KEY;
const MOMO_SECRET_KEY = process.env.MOMO_SECRET_KEY;
const MOMO_ENDPOINT = 'https://test-payment.momo.vn/v2/gateway/api/create';
const REDIRECT_URL = process.env.MOMO_REDIRECT_URL;
const IPN_URL = process.env.MOMO_IPN_URL;

// Tạo orderId + requestId
const genId = () => `${Date.now()}${Math.floor(Math.random() * 1000)}`;

const createMoMoPayment = asyncHandler(async (req, res) => {
    try {
        const { amount } = req.body;
        const userId = req.user._id;

        const RAW_AMOUNT = "50000";
        if (Number(amount) !== 50000) {
            return res.status(400).json({ success: false, message: "Số tiền không hợp lệ" });
        }

        const orderId = genId();
        const requestId = genId();

        const orderInfo = `Gói Pro GrammarlyAI`;
        const extraData = Buffer.from(JSON.stringify({ userId }), "utf8").toString("base64");

        const rawSignature =
            `accessKey=${MOMO_ACCESS_KEY}` +
            `&amount=${RAW_AMOUNT}` +
            `&extraData=${extraData}` +
            `&ipnUrl=${IPN_URL}` +
            `&orderId=${orderId}` +
            `&orderInfo=${orderInfo}` +
            `&partnerCode=${MOMO_PARTNER_CODE}` +
            `&redirectUrl=${REDIRECT_URL}` +
            `&requestId=${requestId}` +
            `&requestType=captureWallet`;

        const signature = crypto
            .createHmac("sha256", MOMO_SECRET_KEY)
            .update(rawSignature)
            .digest("hex");

        const requestBody = {
            partnerCode: MOMO_PARTNER_CODE,
            accessKey: MOMO_ACCESS_KEY,
            partnerName: "GrammarlyAI",
            storeId: "GrammarlyAIStore",
            requestId,
            amount: RAW_AMOUNT,
            orderId,
            orderInfo,
            redirectUrl: REDIRECT_URL,
            ipnUrl: IPN_URL,
            extraData,
            requestType: "captureWallet",
            signature,
            lang: "vi",
        };

        const momoRes = await axios.post(MOMO_ENDPOINT, requestBody);

        if (momoRes.data?.resultCode === 0 && momoRes.data?.payUrl) {
            return res.json({ success: true, payUrl: momoRes.data.payUrl });
        }

        return res.status(500).json({
            success: false,
            message: momoRes.data?.message || "Không tạo được thanh toán MoMo",
            momoResultCode: momoRes.data?.resultCode
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Lỗi khi tạo thanh toán MoMo.",
            detail: error?.response?.data || error.message
        });
    }
});


const handleMoMoIPN = asyncHandler(async (req, res) => {
    try {
        const {
            partnerCode,
            orderId,
            requestId,
            amount,
            orderInfo,
            orderType,
            transId,
            resultCode,
            message,
            payType,
            responseTime,
            extraData,
            signature
        } = req.body;

        const rawSignature =
            `accessKey=${MOMO_ACCESS_KEY}` +
            `&amount=${amount}` +
            `&extraData=${extraData}` +
            `&message=${message}` +
            `&orderId=${orderId}` +
            `&orderInfo=${orderInfo}` +
            `&orderType=${orderType}` +
            `&partnerCode=${partnerCode}` +
            `&payType=${payType}` +
            `&requestId=${requestId}` +
            `&responseTime=${responseTime}` +
            `&resultCode=${resultCode}` +
            `&transId=${transId}`;

        const computedSignature = crypto
            .createHmac("sha256", MOMO_SECRET_KEY)
            .update(rawSignature)
            .digest("hex");

        if (computedSignature !== signature) {
            return res.status(200).json({ resultCode: -1, message: "Signature không hợp lệ" });
        }

        if (Number(resultCode) === 0) {
            const decoded = extraData
                ? JSON.parse(Buffer.from(extraData, "base64").toString("utf8"))
                : {};

            const user = await User.findById(decoded.userId);
            if (user) {
                const now = new Date();
                const expire = new Date(now);
                expire.setMonth(expire.getMonth() + 1);

                user.plan = "pro";
                user.proExpiresAt = expire;
                await user.save();
            }
        }

        return res.status(200).json({ resultCode: 0, message: "OK" });

    } catch (error) {
        return res.status(200).json({ resultCode: -1, message: "Server xử lý IPN lỗi" });
    }
});

module.exports = {
    createMoMoPayment,
    handleMoMoIPN
};
