const asyncHandler = require('express-async-handler');
const OpenAI = require('openai');
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

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

    const completion = await client.chat.completions.create({
        model: 'gpt-4o',
        messages: [
            {
                role: 'system',
                content: [
                    "You correct ONLY English grammar and word choice errors.",
                    "Return ONLY valid JSON (no markdown, no backticks).",
                    "Return ONLY the minimal incorrect word or segment in each correction.",

                    // loại lỗi duy nhất
                    "For each correction, add a 'type' field that is one of: \"grammar\", \"word_choice\".",

                    "For each correction, add a short 'explanation'.",

                    //Format JSON 
                    'JSON format: { "corrected": "...", "corrections": [ { "original": "...", "correct": "...", "type": "...", "explanation": "..." } ], "highlighted_html": "..." }',

                    // highlight
                    "In 'highlighted_html', return the ORIGINAL text, but wrap each minimal incorrect word or segment in <span class=\"ai-error\">...</span>.",
                    "Do NOT change any correct word.",
                    "Do NOT fix the errors inside highlighted_html; only wrap them.",
                    "Preserve all line breaks, spacing, and numbering exactly using \\n.",
                    "If there are no errors, set 'corrections' to an empty array and 'highlighted_html' equal to the original text."
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
