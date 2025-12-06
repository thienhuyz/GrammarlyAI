const HistoryDetailModal = ({ item, onClose }) => {
    if (!item) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-3">
            <div className="bg-white rounded-2xl shadow-xl max-w-5xl w-full max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                    <div>
                        <p className="text-xs text-slate-500">
                            {new Date(item.createdAt).toLocaleString("vi-VN", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </p>

                        <p className="text-sm text-slate-600 mt-1">
                            {item.wordCount} từ – {item.totalErrors} lỗi – Độ chính xác{" "}
                            {Math.max(0, 100 - (item.errorsPer100Words || 0)).toFixed(1)}%
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="px-3 py-1.5 rounded-lg bg-[#016A5E] text-white text-sm hover:bg-[#018f7f] transition cursor-pointer"
                    >
                        Đóng
                    </button>
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 p-6 overflow-y-auto">
                    <div className="border border-[#C7E5DF] rounded-xl bg-[#F5FBFA] p-4">
                        <p className="text-xs font-semibold text-[#016A5E] uppercase mb-2">
                            Văn bản gốc
                        </p>
                        <div
                            className="text-sm text-slate-800 whitespace-pre-wrap"
                            dangerouslySetInnerHTML={{
                                __html: (item.originalHighlightedHtml || item.originalText).replace(
                                    /\n/g,
                                    "<br/>"
                                ),
                            }}
                        />
                    </div>

                    <div className="border border-[#C7E5DF] rounded-xl bg-[#F5FBFA] p-4">
                        <p className="text-xs font-semibold text-[#016A5E] uppercase mb-2">
                            Văn bản đã chỉnh sửa
                        </p>
                        <div
                            className="text-sm text-slate-800 whitespace-pre-wrap"
                            dangerouslySetInnerHTML={{
                                __html: (
                                    item.correctedHighlightedHtml || item.correctedText
                                ).replace(/\n/g, "<br/>"),
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HistoryDetailModal;
