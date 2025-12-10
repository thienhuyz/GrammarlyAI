import { useEffect } from "react";

const InputArea = ({
    text,
    setText,
    aiResult,
    editorRef,
    isPro,
    usageCount,
    maxFreeUses,
}) => {
    useEffect(() => {
        if (!editorRef.current) return;

        if (aiResult && typeof aiResult.highlighted_html === "string") {
            const html = aiResult.highlighted_html.replace(/\n/g, "<br/>");
            editorRef.current.innerHTML = html;
        }
    }, [aiResult, editorRef]);

    const handleInput = (e) => {
        const newText = e.currentTarget.innerText;
        setText(newText);
    };

    return (
        <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto rounded-2xl border border-[#C7E5DF] bg-white/90 px-3 py-2 shadow-sm">
                <div
                    ref={editorRef}
                    contentEditable
                    suppressContentEditableWarning
                    spellCheck={false}
                    className="min-h-full outline-none text-lg text-slate-800 text-justify"
                    onInput={handleInput}
                />
            </div>

            <div className="px-1 pt-2 flex justify-end">
                {isPro ? (
                    <span className="px-3 py-[3px] text-xs font-semibold rounded-full bg-[#26A69A]/10 text-[#1F776D] border border-[#26A69A]/30 shadow-sm">
                        PRO • Không giới hạn lượt kiểm tra
                    </span>
                ) : (
                    <span className="px-3 py-[3px] text-xs font-medium rounded-full bg-slate-100 text-slate-600 border border-slate-300 shadow-sm">
                        Lượt kiểm tra hôm nay:{" "}
                        <span className="font-semibold text-slate-800">
                            {usageCount} / {maxFreeUses}
                        </span>
                    </span>
                )}
            </div>
        </div>
    );
};

export default InputArea;
