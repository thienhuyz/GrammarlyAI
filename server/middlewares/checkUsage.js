const User = require('../models/user');
const asyncHandler = require('express-async-handler');

const MAX_FREE_PER_DAY = 5;

const checkUsage = asyncHandler(async (req, res, next) => {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ success: false, message: 'Không xác thực người dùng' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User không tồn tại' });

    // pro hết hạn đổi lại free
    if (user.plan === 'pro' && user.proExpiresAt && user.proExpiresAt < new Date()) {
        user.plan = 'free';
        user.proExpiresAt = null;
        await user.save();
    }

    if (user.plan === 'pro') {
        return next();
    }

    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10); // yyyy-mm-dd

    if (!user.dailyUsage || !user.dailyUsage.date) {
        user.dailyUsage = { date: todayStr, count: 0 };
    } else {
        const savedStr = new Date(user.dailyUsage.date).toISOString().slice(0, 10);
        if (savedStr !== todayStr) {
            user.dailyUsage = { date: todayStr, count: 0 };
        }
    }

    if (user.dailyUsage.count >= MAX_FREE_PER_DAY) {
        return res.status(403).json({
            success: false,
            message: `Bạn đã dùng hết ${MAX_FREE_PER_DAY} lượt miễn phí hôm nay. Vui lòng nâng cấp gói Pro để dùng không giới hạn.`
        });
    }

    // cho qua, nhưng sau khi check xong grammar sẽ tăng count
    req.userDoc = user; // để controller dùng lại
    next();
});

module.exports = checkUsage;
