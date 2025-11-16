const User = require('../models/user')
const asyncHandler = require('express-async-handler')
const { generateAccessToken, generateRefreshToken } = require('../middlewares/jwt')
const jwt = require('jsonwebtoken')
const sendMail = require('../utils/sendMail')
const crypto = require('crypto')
const resetPasswordTemplate = require('../template/resetPassword');

const register = asyncHandler(async (req, res) => {
    const { email, password, firstname, lastname, mobile } = req.body;

    if (!email || !password || !lastname || !firstname || !mobile) {
        return res.status(400).json({
            success: false,
            message: 'Vui lòng điền đầy đủ tất cả các thông tin cần thiết.',
        })
    }

    const user = await User.findOne({ email });
    if (user) throw new Error('Email này đã được đăng ký. Vui lòng sử dụng email khác.');

    const newUser = await User.create({
        email,
        password,
        firstname,
        lastname,
        mobile
    })

    return res.json({
        success: newUser ? true : false,
        message: newUser ? 'Tạo tài khoản thành công, vui lòng kiểm tra email.' : 'Đã có lỗi xảy ra, vui lòng thử lại sau.',
    })
})


const login = asyncHandler(async (req, res) => {

    const { email, password } = req.body

    if (!email || !password)
        return res.status(400).json({
            success: false,
            message: 'Vui lòng nhập đầy đủ email và mật khẩu.'
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
        throw new Error('Đăng nhập thất bại. Email hoặc mật khẩu không chính xác.')
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
        message: 'Đăng xuất thành công.'
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
    if (!user) throw new Error('Mã đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.')
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
module.exports = {
    register,
    login,
    refreshAccessToken,
    logout,
    forgotPassword,
    resetPassWord,
    getCurrent
}