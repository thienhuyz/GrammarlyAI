// src/pages/Pricing.jsx
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { apiCreateMoMoPayment } from "../../apis";

const Pricing = () => {
    const { isLoggedIn, current } = useSelector((state) => state.user);
    const navigate = useNavigate();

    const handleUpgradeClick = async () => {
        if (!isLoggedIn) {
            navigate("/login", { state: { mode: "login" } });
            return;
        }

        try {
            const res = await apiCreateMoMoPayment(50000);
            if (res?.success && res?.payUrl) {
                window.location.href = res.payUrl;
            } else {
                alert(res?.mes || res?.message || "Không tạo được thanh toán. Vui lòng thử lại.");
            }
        } catch (error) {
            console.error(error);
            alert("Có lỗi xảy ra khi tạo thanh toán. Vui lòng thử lại sau.");
        }
    };

    const isPro = current?.plan === "pro";

    return (
        <div className="min-h-screen bg-linear-to-b from-[#F5FBFA] to-white pt-28 pb-16 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-[#01352F] mb-3">
                        Chọn gói phù hợp với bạn
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Bản Free cho phép bạn kiểm tra tối đa{" "}
                        <span className="font-semibold text-[#016A5E]">5 lần mỗi ngày</span>.
                        Nâng cấp lên{" "}
                        <span className="font-semibold text-[#016A5E]">Pro</span> giúp bạn sử dụng thoải mái không giới hạn
                        và tập trung vào công việc.
                    </p>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Free plan */}
                    <div className="bg-white border border-[#D4ECE7] rounded-2xl p-6 shadow-sm flex flex-col">
                        <h2 className="text-xl font-semibold text-[#01352F] mb-2">Free</h2>
                        <p className="text-sm text-gray-500 mb-4">
                            Phù hợp cho người dùng thử hoặc luyện tập nhẹ nhàng mỗi ngày.
                        </p>

                        <div className="mb-4">
                            <span className="text-3xl font-bold text-[#016A5E]">0đ</span>
                            <span className="text-gray-500 ml-1">/ tháng</span>
                        </div>

                        <ul className="text-sm text-gray-700 space-y-2 mb-6">
                            <li>• Tối đa 5 lần kiểm tra mỗi ngày</li>
                            <li>• Sửa lỗi ngữ pháp và từ vựng tiếng Anh</li>
                            <li>• Highlight lỗi và gợi ý sửa chi tiết</li>
                            <li>• Cho phép tải tài liệu </li>
                        </ul>

                        <button
                            disabled
                            className="mt-auto px-4 py-2 rounded-full border border-gray-300 text-gray-500 text-sm cursor-default cursor-pointer"
                        >
                            Gói hiện tại (Free)
                        </button>
                    </div>

                    {/* Pro plan */}
                    <div className="bg-white border-2 border-[#01A989] rounded-2xl p-6 shadow-lg relative flex flex-col">
                        <div className="absolute -top-3 right-4 px-3 py-1 text-xs font-semibold bg-[#01A989] text-white rounded-full shadow-md">
                            Gợi ý
                        </div>

                        <h2 className="text-xl font-semibold text-[#01352F] mb-2">Pro</h2>
                        <p className="text-sm text-gray-500 mb-4">
                            Dành cho người dùng thường xuyên, sinh viên, nhân viên văn phòng.
                        </p>

                        <div className="mb-4">
                            <span className="text-3xl font-bold text-[#016A5E]">50.000đ</span>
                            <span className="text-gray-500 ml-1">/ tháng</span>
                        </div>

                        <ul className="text-sm text-gray-700 space-y-2 mb-6">
                            <li>• <span className="font-semibold">Không giới hạn</span> số lần kiểm tra trong 1 tháng</li>
                            <li>• Ưu tiên xử lý nhanh hơn</li>
                            <li>• Lưu lịch sử sửa lỗi bài viết theo thời gian</li>
                            <li>• Ghi nhận lỗi và đánh giá sự cải thiện theo thời gian.</li>
                        </ul>

                        {isPro ? (
                            <button
                                disabled
                                className="mt-auto px-4 py-2 rounded-full bg-gray-200 text-gray-600 font-semibold text-sm cursor-default"
                            >
                                Bạn đang dùng gói Pro ✓
                            </button>
                        ) : (
                            <button
                                onClick={handleUpgradeClick}
                                className="mt-auto px-4 py-2 rounded-full bg-linear-to-r from-[#01A989] to-[#016A5E] 
                  text-white font-semibold text-sm shadow-md hover:opacity-90 active:scale-[0.98] transition cursor-pointer"
                            >
                                Nâng cấp Pro ngay
                            </button>
                        )}

                        {isPro && current?.proExpiresAt && (
                            <p className="mt-2 text-xs text-gray-500">
                                Hết hạn: {new Date(current.proExpiresAt).toLocaleDateString("vi-VN")}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pricing;
