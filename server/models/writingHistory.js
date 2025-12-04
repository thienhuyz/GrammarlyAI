const mongoose = require("mongoose");

const correctionSchema = new mongoose.Schema(
    {
        original: String,
        correct: String,
        type: String,
        explanation: String,
    },
    { _id: false }
);

const writingHistorySchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

        originalText: { type: String, required: true },
        correctedText: { type: String, required: true },

        originalHighlightedHtml: { type: String },
        correctedHighlightedHtml: { type: String },

        corrections: [correctionSchema],

        totalErrors: { type: Number, default: 0 },
        grammarErrors: { type: Number, default: 0 },
        wordChoiceErrors: { type: Number, default: 0 },

        wordCount: { type: Number, default: 0 },
        errorsPer100Words: { type: Number, default: 0 },
    },
    { timestamps: true }
);

module.exports = mongoose.model("WritingHistory", writingHistorySchema);
