const router = require('express').Router();
const ctrls = require('../controllers/writingHistory');
const { verifyAccessToken } = require('../middlewares/verifyToken');

router.post('/', verifyAccessToken, ctrls.createHistory);
router.get('/', verifyAccessToken, ctrls.getMyHistory);

module.exports = router;
