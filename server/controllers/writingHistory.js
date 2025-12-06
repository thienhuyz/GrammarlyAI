const asyncHandler = require("express-async-handler");
const WritingHistory = require("../models/writingHistory");

const createHistory = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const {
        originalText,
        correctedText,
        originalHighlightedHtml,
        correctedHighlightedHtml,
        corrections = [],
        totalErrors,
        grammarErrors,
        wordChoiceErrors,
        wordCount,
    } = req.body;

    if (!originalText || !correctedText) {
        return res.status(400).json({
            success: false,
            mes: "Thiếu nội dung để lưu lịch sử.",
        });
    }

    const wordCountSafe = wordCount || 0;
    const totalErrorsSafe = totalErrors ?? corrections.length;
    const errorsPer100Words =
        wordCountSafe > 0 ? (totalErrorsSafe / wordCountSafe) * 100 : 0;

    const doc = await WritingHistory.create({
        user: userId,
        originalText,
        correctedText,

        originalHighlightedHtml,
        correctedHighlightedHtml,

        corrections,
        totalErrors: totalErrorsSafe,
        grammarErrors: grammarErrors || 0,
        wordChoiceErrors: wordChoiceErrors || 0,
        wordCount: wordCountSafe,
        errorsPer100Words,
    });

    return res.status(201).json({
        success: true,
        data: doc,
    });
});

const getMyHistory = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
        WritingHistory.find({ user: userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        WritingHistory.countDocuments({ user: userId }),
    ]);

    return res.status(200).json({
        success: true,
        data: { items, total, page, limit },
    });
});

module.exports = {
    createHistory,
    getMyHistory,
};
