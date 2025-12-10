const asyncHandler = require('express-async-handler');
const OpenAI = require('openai');
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const User = require('../models/user');

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});


const checkGrammar = asyncHandler(async (req, res) => {
    const { text } = req.body;

    if (!text || !text.trim()) {
        return res.status(400).json({
            success: false,
            mes: 'Thiếu đoạn văn cần kiểm tra.',
        });
    }

    const userId = req.user?._id;
    if (!userId) {
        return res.status(401).json({
            success: false,
            mes: 'Người dùng chưa đăng nhập.',
        });
    }

    let user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({
            success: false,
            mes: 'Không tìm thấy người dùng.',
        });
    }

    const completion = await client.chat.completions.create({
        model: 'gpt-4o',
        messages: [
            {
                role: 'system',
                content: [
                    "You correct ONLY English grammar and word choice errors.",
                    "Return ONLY valid JSON (no markdown, no backticks).",
                    "Return ONLY the minimal incorrect word or segment in each correction.",

                    // loại lỗi
                    "For each correction, add a 'type' field that is one of: \"grammar\", \"word_choice\".",
                    "For each correction, add a short 'explanation'.",

                    // Format JSON – ĐÃ ĐỔI
                    'JSON format: { "corrected": "...", "corrections": [ { "original": "...", "correct": "...", "type": "...", "explanation": "..." } ], "highlighted_html": "...", "corrected_highlighted_html": "..." }',

                    // highlight bản gốc
                    "In 'highlighted_html', return the ORIGINAL text, but wrap each minimal incorrect word or segment in <span class=\"ai-error\">...</span>.",
                    "Do NOT change any correct word in 'highlighted_html'.",
                    "Do NOT fix the errors inside 'highlighted_html'; only wrap them.",
                    "Preserve all line breaks, spacing, and numbering exactly using \\n.",

                    // highlight bản đã chỉnh sửa
                    "In 'corrected_highlighted_html', return the FULLY CORRECTED text.",
                    "In 'corrected_highlighted_html', wrap each corrected word or segment in <span class=\"ai-correct\">...</span>.",
                    "If there are no errors, set 'corrections' to an empty array, 'highlighted_html' equal to the original text, and 'corrected_highlighted_html' equal to the original text.",
                ].join(" ")
            },
            {
                role: 'user',
                content: text,
            },
        ],
        temperature: 0,
    });

    const rawContent = completion.choices?.[0]?.message?.content;

    let result;
    try {
        result = JSON.parse(rawContent);
    } catch (err) {
        return res.status(500).json({
            success: false,
            mes: 'Phản hồi từ AI không phải JSON hợp lệ.',
            raw: rawContent,
        });
    }

    if (user.plan !== 'pro') {
        user.dailyUsage.count += 1;
    }

    await user.save();

    return res.status(200).json({
        success: true,
        data: result,
    });
});

const uploadDoc = asyncHandler(async (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            success: false,
            mes: "Không có file được tải lên",
        });
    }

    const buffer = req.file.buffer;
    const name = req.file.originalname.toLowerCase();
    let text = "";

    if (name.endsWith(".pdf")) {
        const data = await pdfParse(buffer);
        text = data.text;
    } else if (name.endsWith(".docx") || name.endsWith(".doc")) {
        const data = await mammoth.extractRawText({ buffer });
        text = data.value;
    } else {
        return res.status(400).json({
            success: false,
            mes: "File không hỗ trợ",
        });
    }

    return res.status(200).json({
        success: true,
        content: text,
    });

});


module.exports = {
    checkGrammar,
    uploadDoc
};
