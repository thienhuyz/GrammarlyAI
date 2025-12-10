const router = require('express').Router();
const ctrls = require('../controllers/grammar');
const { verifyAccessToken } = require('../middlewares/verifyToken');
const upload = require("../middlewares/uploadFile");
const checkUsage = require('../middlewares/checkUsage');


router.post('/check', verifyAccessToken, checkUsage, ctrls.checkGrammar);
router.post("/upload", verifyAccessToken, upload.single("file"), ctrls.uploadDoc);
module.exports = router;
