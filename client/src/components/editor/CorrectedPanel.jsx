import { TrashIcon, DocumentDuplicateIcon, ArrowDownOnSquareIcon, ShieldCheckIcon } from "../../utils/icon";

const CorrectedPanel = ({
    aiResult,
    loading,
    error,
    hasCorrected,
    text,
    onCheckGrammar,
    onCopy,
    onDownload,
    onClear,
}) => {
    return (
        <div className="flex-1 min-h-0">
            <div className="h-full flex flex-col bg-white/90 border border-[#B8E0DB] rounded-2xl p-4 shadow-sm">
                {/* Header + Buttons */}
                <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
                    <p className="text-xs font-semibold text-[#016A5E] uppercase tracking-wide">
                        Văn bản chỉnh sửa
                    </p>
                    <div className="flex items-center gap-2 text-xs sm:text-sm flex-wrap justify-end">
                        <button
                            onClick={onCheckGrammar}
                            className="px-3 py-1.5 rounded-lg bg-[#016A5E] text-white font-medium shadow-sm hover:bg-[#018f7f] transition disabled:opacity-60 cursor-pointer
               flex items-center gap-2"
                            disabled={loading || !text.trim()}
                        >
                            <ShieldCheckIcon className="w-3 h-3" />
                            {loading ? "Đang kiểm tra..." : "Kiểm tra"}
                        </button>


                        <button
                            onClick={onCopy}
                            className="px-3 py-1.5 rounded-lg bg-[#F5FBFA] text-[#016A5E] border border-[#C7E5DF] flex items-center gap-1 hover:bg-[#E6F4F1] transition disabled:opacity-40 cursor-pointer"
                            disabled={!hasCorrected || loading}
                        >
                            <DocumentDuplicateIcon className="w-3 h-3" />
                            <span>Sao chép</span>
                        </button>
                        <button
                            onClick={onDownload}
                            className="px-3 py-1.5 rounded-lg bg-[#F5FBFA] text-[#016A5E] border border-[#C7E5DF] flex items-center gap-1 hover:bg-[#E6F4F1] transition disabled:opacity-40 cursor-pointer"
                            disabled={!hasCorrected || loading}
                        >
                            <ArrowDownOnSquareIcon className="w-3 h-3" />
                            <span>Lưu</span>
                        </button>



                        <button
                            onClick={onClear}
                            className="px-3 py-1.5 rounded-lg bg-[#F5FBFA] text-[#016A5E] border border-[#C7E5DF] flex items-center gap-1 hover:bg-[#E6F4F1] transition disabled:opacity-40 cursor-pointer"
                            disabled={loading && !text}
                        >
                            <TrashIcon className="w-3 h-3" />
                            <span>Xóa</span>
                        </button>
                    </div>
                </div>

                {/* Nội dung câu đã chỉnh sửa / placeholder */}
                <div className="flex-1 overflow-y-auto">
                    {aiResult && !loading && !error ? (
                        <p className="text-lg  text-justify whitespace-pre-wrap text-slate-800">
                            <div
                                dangerouslySetInnerHTML={{ __html: aiResult.corrected_highlighted_html }}
                            />

                        </p>
                    ) : (
                        <div className="h-full flex items-center justify-center text-sm text-slate-500">
                            Kết quả chỉnh sửa sẽ hiển thị ở đây sau khi bạn bấm {""}
                            <span className="font-semibold text-[#016A5E]">
                                “Kiểm tra”
                            </span>.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CorrectedPanel;
