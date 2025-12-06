const HistoryCard = ({ item, improvement, accuracy, htmlPreview, onClick }) => {
    return (
        <div
            onClick={onClick}
            className="p-4 bg-white border border-[#C7E5DF] rounded-xl shadow-sm hover:shadow-md transition cursor-pointer"
        >
            <div className="flex justify-between items-center mb-2 flex-wrap">
                <p className="text-xs text-slate-500">
                    {new Date(item.createdAt).toLocaleString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </p>

                <div className="flex items-center gap-3 text-xs flex-wrap">
                    <span className="px-2 py-1 rounded-full bg-[#E6F4F1] text-[#016A5E] border border-[#B8E0DB]">
                        {item.wordCount} từ
                    </span>

                    <span className="px-2 py-1 rounded-full bg-orange-100 text-orange-700 border border-orange-200">
                        {item.totalErrors} lỗi
                    </span>

                    <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        Độ chính xác {accuracy.toFixed(1)}%
                    </span>

                    {improvement && (
                        <span
                            className={
                                "px-2 py-1 rounded-full text-xs border " +
                                (improvement.type === "better"
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : improvement.type === "worse"
                                        ? "bg-rose-50 text-rose-700 border-rose-200"
                                        : "bg-slate-50 text-slate-600 border-slate-200")
                            }
                        >
                            {improvement.label}
                        </span>
                    )}
                </div>
            </div>

            <div
                className="text-sm text-slate-800 line-clamp-3 whitespace-pre-wrap"
                dangerouslySetInnerHTML={{
                    __html: htmlPreview.replace(/\n/g, "<br/>"),
                }}
            />
        </div>
    );
};

export default HistoryCard;
