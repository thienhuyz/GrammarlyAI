const router = require('express').Router()
const ctrls = require('../controllers/user')

/**
 * @swagger
 * /api/user/register:
 * post:
 * summary: Đăng ký một người dùng mới
 * tags: [User]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * email:
 * type: string
 * description: Email của người dùng
 * password:
 * type: string
 * description: Mật khẩu (tối thiểu 6 ký tự)
 * firstname:
 * type: string
 * description: Tên
 * lastname:
 * type: string
 * description: Họ
 * responses:
 * '201':
 * description: Đăng ký thành công
 * '400':
 * description: Thiếu dữ liệu hoặc email đã tồn tại
 */
router.post('/register', ctrls.register);


module.exports = router