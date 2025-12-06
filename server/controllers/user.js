const User = require('../models/user')
const asyncHandler = require('express-async-handler')
const { generateAccessToken, generateRefreshToken } = require('../middlewares/jwt')
const jwt = require('jsonwebtoken')
const sendMail = require('../utils/sendMail')
const crypto = require('crypto')
const resetPasswordTemplate = require('../template/resetPassword');
const otpRegister = require('../template/otpRegister');

const register = asyncHandler(async (req, res) => {
    const { email, password, firstname, lastname, mobile } = req.body;

    if (!email || !password || !lastname || !firstname || !mobile) {
        return res.status(400).json({
            success: false,
            mes: 'Không được để trống',
        });
    }

    const user = await User.findOne({ email });
    if (user) throw new Error('Tài khoản đã tồn tại');

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser = await User.create({
        email,
        password,
        firstname,
        lastname,
        mobile,
        otp,
        otpExpires: Date.now() + 5 * 60 * 1000,
        isVerified: false,
        otpRequestCount: 1,
        lastOtpSentAt: Date.now(),
    });

    const html = otpRegister(otp);

    await sendMail({
        email,
        html,
        subject: 'Mã OTP đăng ký tài khoản',
    });

    return res.json({
        success: true,
        mes: "OTP đã được gửi đến email của bạn",
    });
});

const verifyOTP = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({
            success: false,
            mes: "Thiếu email hoặc OTP"
        });
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.json({
            success: false,
            mes: "Tài khoản không tồn tại"
        });
    }

    if (user.otp !== otp) {
        return res.json({
            success: false,
            mes: "OTP không đúng"
        });
    }
    // console.log(user.otpExpires, Date.now());
    if (user.otpExpires < Date.now()) {

        return res.json({
            success: false,
            mes: "OTP đã hết hạn"
        });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return res.json({
        success: true,
        mes: "Xác thực tài khoản thành công"
    });
});


const resendOTP = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            success: false,
            mes: "Thiếu email"
        });
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.json({
            success: false,
            mes: "Tài khoản không tồn tại"
        });
    }

    if (user.isVerified) {
        return res.json({
            success: false,
            mes: "Tài khoản này đã được xác thực rồi"
        });
    }

    if (user.otpRequestCount >= 3) {
        return res.json({
            success: false,
            mes: "Bạn đã vượt quá số lần gửi OTP. Vui lòng thử lại sau hoặc đăng ký lại."
        });
    }


    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;
    user.otpRequestCount += 1;
    user.lastOtpSentAt = Date.now();
    await user.save();

    const html = otpRegister(otp);


    await sendMail({
        email,
        html,
        subject: 'Mã OTP đăng ký (gửi lại)',
    });

    return res.json({
        success: true,
        mes: "OTP mới đã được gửi đến email của bạn",
    });
});



const login = asyncHandler(async (req, res) => {

    const { email, password } = req.body

    if (!email || !password)
        return res.status(400).json({
            success: false,
            mes: 'Vui lòng nhập đầy đủ email và mật khẩu.'
        })

    const response = await User.findOne({ email })
    if (response && await response.isCorrectPassword(password)) {
        const { password, role, refreshToken, ...userData } = response.toObject()
        const accessToken = generateAccessToken(response._id, role)
        const newRefreshToken = generateRefreshToken(response._id)
        await User.findByIdAndUpdate(response._id, { refreshToken: newRefreshToken }, { new: true })
        res.cookie('refreshToken', newRefreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 })
        return res.status(200).json({
            success: true,
            accessToken,
            userData
        })
    } else {
        throw new Error('Email hoặc mật khẩu không chính xác.')
    }

})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const cookie = req.cookies
    if (!cookie || !cookie.refreshToken) throw new Error('Không tìm thấy refresh token trong cookie.')
    const rs = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET)
    const response = await User.findOne({ _id: rs._id, refreshToken: cookie.refreshToken })
    return res.status(200).json({
        success: response ? true : false,
        newAccessToken: response ? generateAccessToken(response._id, response.role) : 'Refresh token không hợp lệ.'
    })
})

const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies
    if (!cookie || !cookie.refreshToken) throw new Error('Không tìm thấy refresh token trong cookie.')
    await User.findOneAndUpdate({ refreshToken: cookie.refreshToken }, { refreshToken: '' }, { new: true })
    res.clearCookie('refreshToken', { httpOnly: true })
    return res.status(200).json({
        success: true,
        mes: 'Đăng xuất thành công.'
    })
})

const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body


    if (!email) throw new Error('Vui lòng nhập email.')
    const user = await User.findOne({ email })
    if (!user) throw new Error('Không tìm thấy tài khoản với email này.')
    const resetToken = user.createPasswordChangedToken()
    await user.save()

    const html = resetPasswordTemplate(resetToken);

    const data = {
        email,
        html,
        subject: 'Yêu cầu đặt lại mật khẩu'
    }
    const rs = await sendMail(data)
    // console.log(rs)

    return res.status(200).json({
        success: rs.response?.includes('OK') ? true : false,
        mes: rs.response?.includes('OK') ? 'Vui lòng kiểm tra email của bạn.' : 'Đã có lỗi xảy ra, vui lòng thử lại sau.'
    })
})

const resetPassWord = asyncHandler(async (req, res) => {
    const { password, token } = req.body
    if (!password || !token) throw new Error('Vui lòng nhập đầy đủ mật khẩu và mã xác nhận.')
    const passwordResetToken = crypto.createHash('sha256').update(token).digest('hex')
    const user = await User.findOne({ passwordResetToken, passwordResetExpires: { $gt: Date.now() } })
    if (!user) throw new Error('Mã đặt lại mật khẩu hết hạn.')
    user.password = password
    user.passwordResetToken = undefined
    user.passwordChangedAt = Date.now()
    user.passwordResetExpires = undefined
    await user.save()
    return res.status(200).json({
        success: user ? true : false,
        mes: user ? 'Cập nhật mật khẩu thành công.' : 'Đã xảy ra lỗi, vui lòng thử lại sau.'
    })
})

const getCurrent = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const user = await User.findById(_id).select('-refreshToken -password')
    return res.status(200).json({
        success: user ? true : false,
        rs: user ? user : 'Không tìm thấy người dùng.'
    })
})

const updateErrorStats = asyncHandler(async (req, res) => {
    const { _id } = req.user; // lấy từ middleware verifyAccessToken
    const { grammar = 0, word_choice = 0 } = req.body || {};

    if (!grammar && !word_choice) {
        return res.status(400).json({
            success: false,
            mes: 'Không có dữ liệu lỗi để cập nhật.',
        });
    }

    const user = await User.findByIdAndUpdate(
        _id,
        {
            $inc: {
                'errorStats.grammar': grammar,
                'errorStats.word_choice': word_choice,
            },
        },
        { new: true }
    ).select('-refreshToken -password');

    return res.status(200).json({
        success: user ? true : false,
        rs: user || 'Không tìm thấy người dùng.',
    });
});

const updateUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;

    if (!_id) throw new Error("Missing user id");

    const { firstname, lastname, mobile } = req.body;

    const data = {};
    if (firstname !== undefined) data.firstname = firstname;
    if (lastname !== undefined) data.lastname = lastname;
    if (mobile !== undefined) data.mobile = mobile;

    if (Object.keys(data).length === 0) {
        return res.status(400).json({
            success: false,
            mes: "Không có dữ liệu để cập nhật.",
        });
    }

    const response = await User.findByIdAndUpdate(_id, data, {
        new: true,
    }).select("-password -refreshToken");

    return res.status(200).json({
        success: response ? true : false,
        mes: response ? "Cập nhật thành công" : "Đã xảy ra lỗi",
        rs: response || null,
    });
});

const getUsers = asyncHandler(async (req, res) => {
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 10;
    const name = req.query.name?.trim() || "";
    const sort = req.query.sort || "-createdAt";

    const formattedQueries = {};

    if (name) {
        formattedQueries.$or = [
            { firstname: { $regex: name, $options: "i" } },
            { lastname: { $regex: name, $options: "i" } },
            { email: { $regex: name, $options: "i" } },
        ];
    }

    const skip = (page - 1) * limit;

    const [users, counts] = await Promise.all([
        User.find(formattedQueries)
            .sort(sort)
            .select("-password -refreshToken")
            .skip(skip)
            .limit(limit)
            .exec(),
        User.countDocuments(formattedQueries),
    ]);

    return res.status(200).json({
        success: true,
        counts,
        users,
    });
});


const updateUserByAdmin = asyncHandler(async (req, res) => {
    const { uid } = req.params;
    if (!uid) throw new Error("Thiếu ID người dùng");


    if (!Object.keys(req.body).length)
        throw new Error("Không có dữ liệu để cập nhật");

    const ALLOW = ["firstname", "lastname", "email", "mobile", "role"];
    const dataUpdate = {};

    for (const key of ALLOW) {
        if (req.body[key] !== undefined) {
            dataUpdate[key] = req.body[key];
        }
    }

    if (!Object.keys(dataUpdate).length)
        throw new Error("Không có trường hợp lệ để cập nhật");

    const user = await User.findByIdAndUpdate(uid, dataUpdate, {
        new: true,
    }).select("-password -refreshToken");

    return res.status(200).json({
        success: !!user,
        user: user || null,
        mes: user ? "Cập nhật người dùng thành công" : "Không tìm thấy người dùng",
    });
});


const deleteUser = asyncHandler(async (req, res) => {
    const { uid } = req.params;
    if (!uid) throw new Error("Thiếu ID người dùng");

    const response = await User.findByIdAndDelete(uid);

    return res.status(200).json({
        success: !!response,
        mes: response
            ? `Đã xóa người dùng có email: ${response.email}`
            : "Không tìm thấy người dùng để xóa",
    });
});

const getErrorStats = asyncHandler(async (req, res) => {
    const stats = await User.aggregate([
        {
            $group: {
                _id: null,
                totalGrammar: { $sum: "$errorStats.grammar" },
                totalWordChoice: { $sum: "$errorStats.word_choice" },
            },
        },
    ]);

    const { totalGrammar = 0, totalWordChoice = 0 } = stats[0] || {};

    return res.status(200).json({
        success: true,
        data: {
            totalGrammar,
            totalWordChoice,
        },
    });
});



module.exports = {
    register,
    verifyOTP,
    resendOTP,
    login,
    refreshAccessToken,
    logout,
    forgotPassword,
    resetPassWord,
    getCurrent,
    updateErrorStats,
    updateUser,
    getUsers,
    updateUserByAdmin,
    deleteUser,
    getErrorStats,
}