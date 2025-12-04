const router = require('express').Router();
const ctrls = require('../controllers/writingHistory');
const { verifyAccessToken } = require('../middlewares/verifyToken');

router.use(verifyAccessToken);
router.post('/', ctrls.createHistory);
router.get('/', ctrls.getMyHistory);

module.exports = router;
