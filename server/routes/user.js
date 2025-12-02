const router = require('express').Router()
const ctrls = require('../controllers/user')
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')

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

router.get('/admin/users', verifyAccessToken, isAdmin, ctrls.getUsers);
router.put('/admin/users/:uid', verifyAccessToken, isAdmin, ctrls.updateUserByAdmin);
router.delete('/admin/users/:uid', verifyAccessToken, isAdmin, ctrls.deleteUser);

module.exports = router