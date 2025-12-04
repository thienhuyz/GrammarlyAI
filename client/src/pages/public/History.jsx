import { useEffect, useState } from "react";
import { apiGetWritingHistory } from "../../apis";
import { toast } from "react-toastify";

const getImprovement = (currentErr, prevErr) => {
    if (prevErr == null || prevErr <= 0) return null;

    const diff = prevErr - currentErr;
    const percent = (diff / prevErr) * 100;

    if (Math.abs(percent) < 0.5) {
        return { type: "same", label: "Giữ ổn định" };
    }

    if (percent > 0) {
        return {
            type: "better",
            label: `Tiến bộ ${percent.toFixed(1)}%`,
        };
    }

    return {
        type: "worse",
        label: `Tăng lỗi ${Math.abs(percent).toFixed(1)}%`,
    };
};

const History = () => {
    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [loading, setLoading] = useState(false);

    const [selectedItem, setSelectedItem] = useState(null);

    const fetchHistory = async (pageNumber = 1) => {
        try {
            setLoading(true);

            const res = await apiGetWritingHistory({
                page: pageNumber,
                limit,
            });

            if (!res?.success) {
                const msg = res?.mes || "Không lấy được lịch sử luyện viết.";
                toast.error(msg);
                return;
            }

            const data = res.data || {};
            setItems(data.items || []);
            setTotal(data.total || 0);
            setPage(data.page || 1);
        } catch (err) {
            toast.error("Lỗi tải lịch sử.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory(1);
    }, []);

    const totalPages = Math.max(1, Math.ceil(total / limit));

    return (
        <div className="h-[calc(100vh-72px)] w-full flex bg-[#E6F4F1] text-slate-900">
            <main className="flex-1 flex overflow-hidden">
                <div className="flex-1 flex flex-col min-h-0">
                    <div className="flex-1 flex bg-[#F5FBFA] border border-[#B8E0DB] rounded-2xl shadow-sm m-6 min-h-0">
                        <div className="flex-1 flex flex-col p-6 min-h-0 overflow-y-auto">

                            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                                <h1 className="text-xl font-semibold text-[#016A5E]">
                                    Lịch sử luyện viết
                                </h1>
                                <p className="text-sm text-slate-500">
                                    Tổng:{" "}
                                    <span className="font-semibold">{total}</span> bài
                                </p>
                            </div>

                            {loading ? (
                                <div className="flex-1 flex items-center justify-center text-[#016A5E]">
                                    Đang tải lịch sử...
                                </div>
                            ) : items.length === 0 ? (
                                <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
                                    Chưa có bài viết nào.
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col gap-4">

                                    {items.map((item, index) => {
                                        const prevItem = items[index + 1];
                                        const improvement = prevItem
                                            ? getImprovement(
                                                item.errorsPer100Words,
                                                prevItem.errorsPer100Words
                                            )
                                            : null;

                                        const htmlPreview =
                                            item.correctedHighlightedHtml ||
                                            item.originalHighlightedHtml ||
                                            item.correctedText ||
                                            item.originalText ||
                                            "";

                                        const accuracy = Math.max(
                                            0,
                                            100 - (item.errorsPer100Words || 0)
                                        );

                                        return (
                                            <div
                                                key={item._id}
                                                onClick={() => setSelectedItem(item)} // 🆕 click mở modal
                                                className="p-4 bg-white border border-[#C7E5DF] rounded-xl shadow-sm hover:shadow-md transition cursor-pointer"
                                            >
                                                <div className="flex justify-between items-center mb-2 flex-wrap">
                                                    <p className="text-xs text-slate-500">
                                                        {new Date(
                                                            item.createdAt
                                                        ).toLocaleString("vi-VN", {
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
                                                            Độ chính xác{" "}
                                                            {accuracy.toFixed(1)}%
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
                                                        __html: htmlPreview.replace(
                                                            /\n/g,
                                                            "<br/>"
                                                        ),
                                                    }}
                                                />
                                            </div>
                                        );
                                    })}

                                    {totalPages > 1 && (
                                        <div className="flex items-center justify-center gap-3 mt-4 text-sm">
                                            <button
                                                onClick={() => fetchHistory(page - 1)}
                                                disabled={page <= 1}
                                                className="px-3 py-1.5 rounded-lg border border-[#C7E5DF] bg-white text-[#016A5E] hover:bg-[#E6F4F1] disabled:opacity-50"
                                            >
                                                Trang trước
                                            </button>

                                            <span className="text-slate-600">
                                                Trang <b>{page}</b> / {totalPages}
                                            </span>

                                            <button
                                                onClick={() => fetchHistory(page + 1)}
                                                disabled={page >= totalPages}
                                                className="px-3 py-1.5 rounded-lg border border-[#C7E5DF] bg-white text-[#016A5E] hover:bg-[#E6F4F1] disabled:opacity-50"
                                            >
                                                Trang sau
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </main>

            {selectedItem && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-3">
                    <div className="bg-white rounded-2xl shadow-xl max-w-5xl w-full max-h-[90vh] flex flex-col">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                            <div>
                                <p className="text-xs text-slate-500">
                                    {new Date(
                                        selectedItem.createdAt
                                    ).toLocaleString("vi-VN", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </p>
                                <p className="text-sm text-slate-600 mt-1">
                                    {selectedItem.wordCount} từ –{" "}
                                    {selectedItem.totalErrors} lỗi – Độ chính xác{" "}
                                    {Math.max(
                                        0,
                                        100 - (selectedItem.errorsPer100Words || 0)
                                    ).toFixed(1)}
                                    %
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedItem(null)}
                                className="px-3 py-1.5 rounded-lg bg-[#016A5E] text-white text-sm hover:bg-[#018f7f]"
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
                                        __html: (
                                            selectedItem.originalHighlightedHtml ||
                                            selectedItem.originalText ||
                                            ""
                                        ).replace(/\n/g, "<br/>"),
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
                                            selectedItem.correctedHighlightedHtml ||
                                            selectedItem.correctedText ||
                                            ""
                                        ).replace(/\n/g, "<br/>"),
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default History;
