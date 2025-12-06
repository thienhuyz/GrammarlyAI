import { useEffect, useState } from "react";
import { apiGetWritingHistory } from "../../apis";
import { toast } from "react-toastify";

import HistoryCard from "../../components/history/HistoryCard";
import HistoryDetailModal from "../../components/history/HistoryDetailModal";

const getImprovement = (currentErr, prevErr) => {
    if (prevErr == null || prevErr <= 0) return null;

    const diff = prevErr - currentErr;
    const percent = (diff / prevErr) * 100;

    if (Math.abs(percent) < 0.5) {
        return { type: "same", label: "Giữ ổn định" };
    }
    if (percent > 0) {
        return { type: "better", label: `Tiến bộ ${percent.toFixed(1)}%` };
    }

    return { type: "worse", label: `Tăng lỗi ${Math.abs(percent).toFixed(1)}%` };
};

const History = () => {
    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [limit] = useState(5);
    const [loading, setLoading] = useState(false);

    const [selectedItem, setSelectedItem] = useState(null);

    const fetchHistory = async (pageNumber = 1) => {
        try {
            setLoading(true);

            const res = await apiGetWritingHistory({ page: pageNumber, limit });
            if (!res?.success) return toast.error("Không lấy được lịch sử.");

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
                    <div className="flex-1 bg-[#F5FBFA] border border-[#B8E0DB] rounded-2xl shadow-sm m-6 p-6 overflow-y-auto">

                        <div className="flex items-center justify-between mb-4">
                            <h1 className="text-xl font-semibold text-[#016A5E]">
                                Lịch sử luyện viết
                            </h1>
                            <p className="text-sm text-slate-500">
                                Tổng: <span className="font-semibold">{total}</span> bài
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
                            <div className="flex flex-col gap-4">
                                {items.map((item, index) => {
                                    const prevItem = items[index + 1];
                                    const improvement = prevItem
                                        ? getImprovement(
                                            item.errorsPer100Words,
                                            prevItem.errorsPer100Words
                                        )
                                        : null;

                                    const accuracy = Math.max(
                                        0,
                                        100 - (item.errorsPer100Words || 0)
                                    );

                                    const htmlPreview =
                                        item.correctedHighlightedHtml ||
                                        item.originalHighlightedHtml ||
                                        item.correctedText ||
                                        item.originalText;

                                    return (
                                        <HistoryCard
                                            key={item._id}
                                            item={item}
                                            improvement={improvement}
                                            accuracy={accuracy}
                                            htmlPreview={htmlPreview}
                                            onClick={() => setSelectedItem(item)}
                                        />
                                    );
                                })}
                            </div>
                        )}

                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-3 mt-4 text-sm">
                                <button
                                    onClick={() => fetchHistory(page - 1)}
                                    disabled={page <= 1}
                                    className="px-3 py-1.5 rounded-lg border bg-white text-[#016A5E] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Trang trước
                                </button>

                                <span className="text-slate-600">
                                    Trang <b>{page}</b> / {totalPages}
                                </span>

                                <button
                                    onClick={() => fetchHistory(page + 1)}
                                    disabled={page >= totalPages}
                                    className="px-3 py-1.5 rounded-lg border bg-white text-[#016A5E] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Trang sau
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <HistoryDetailModal
                item={selectedItem}
                onClose={() => setSelectedItem(null)}
            />
        </div>
    );
};

export default History;
