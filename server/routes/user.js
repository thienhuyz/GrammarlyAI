const router = require('express').Router()
const ctrls = require('../controllers/user')
const { verifyAccessToken } = require('../middlewares/verifyToken')

router.post('/register', ctrls.register);
router.post('/verify-otp', ctrls.verifyOTP);
router.post('/resend-otp', ctrls.resendOTP);
router.post('/login', ctrls.login)
router.get('/current', verifyAccessToken, ctrls.getCurrent)
router.post('/refreshtoken', ctrls.refreshAccessToken)
router.get('/logout', ctrls.logout)
router.post('/forgotpassword', ctrls.forgotPassword)
router.put('/resetpassword', ctrls.resetPassWord)
router.put('/error-stats', verifyAccessToken, ctrls.updateErrorStats);
router.put('/current', verifyAccessToken, ctrls.updateUser);

module.exports = router