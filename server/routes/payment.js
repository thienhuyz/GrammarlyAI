const router = require('express').Router();
const { verifyAccessToken } = require('../middlewares/verifyToken');
const { createMoMoPayment, handleMoMoIPN } = require('../controllers/payment');

router.post('/momo', verifyAccessToken, createMoMoPayment);
router.post('/momo/ipn', handleMoMoIPN);

module.exports = router;
