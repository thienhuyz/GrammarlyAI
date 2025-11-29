import { useEffect } from "react";
import { toast } from "react-toastify";

const MAX_WORDS = 200;

const InputArea = ({ text, setText, wordCount, aiResult, editorRef }) => {
    useEffect(() => {
        if (!editorRef.current) return;

        if (aiResult && typeof aiResult.highlighted_html === "string") {
            const html = aiResult.highlighted_html.replace(/\n/g, "<br/>");
            editorRef.current.innerHTML = html;
        }
    }, [aiResult, editorRef]);

    const handleInput = (e) => {
        const newText = e.currentTarget.innerText;
        const words = newText.trim().split(/\s+/)

        if (words.length > MAX_WORDS) {
            e.currentTarget.innerText = text;

            toast.warn(`Giới hạn tối đa ${MAX_WORDS} từ.`, {
                position: "top-right",
                autoClose: 2000,
            });

            return;
        }

        setText(newText);
    };

    return (
        <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto rounded-2xl border border-[#C7E5DF] bg-white/90 px-3 py-2">
                <div
                    ref={editorRef}
                    contentEditable
                    suppressContentEditableWarning
                    spellCheck={false}
                    className="min-h-full outline-none text-lg text-slate-800 text-justify"
                    onInput={handleInput}
                />
            </div>
            <div className="px-1 pt-2 text-xs text-right text-slate-500">
                {wordCount} / {MAX_WORDS} từ
            </div>
        </div>
    );
};

export default InputArea;
