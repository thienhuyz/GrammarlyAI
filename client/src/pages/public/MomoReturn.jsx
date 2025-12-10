import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
    CheckCircleIcon,
    ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

const MomoReturn = () => {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState(null);

    useEffect(() => {
        const resultCode = searchParams.get("resultCode");
        const message = searchParams.get("message");

        if (resultCode === "0") {
            setStatus({
                success: true,
                message:
                    "Thanh toán thành công! Gói Pro sẽ được kích hoạt trong giây lát.",
            });
        } else {
            setStatus({
                success: false,
                message: message || "Thanh toán thất bại hoặc đã bị hủy.",
            });
        }
    }, [searchParams]);

    if (!status) return null;

    const isSuccess = status.success;

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#F5FBFA] via-[#ECF4FF] to-[#FDF2FF] px-4">
            <div className="w-full max-w-lg">
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-white/60 px-8 py-10">

                    <div className="flex flex-col items-center mb-8">
                        <div
                            className={`flex h-16 w-16 items-center justify-center rounded-full shadow-md mb-4 border
                ${isSuccess
                                    ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                    : "bg-rose-50 text-rose-600 border-rose-100"
                                }`}
                        >
                            {isSuccess ? (
                                <CheckCircleIcon className="w-10 h-10" />
                            ) : (
                                <ExclamationTriangleIcon className="w-10 h-10" />
                            )}
                        </div>

                        <h1
                            className={`text-2xl font-bold tracking-tight mb-1 text-center
                ${isSuccess ? "text-emerald-700" : "text-rose-700"}`}
                        >
                            {isSuccess ? "Thanh toán thành công" : "Thanh toán không thành công"}
                        </h1>

                    </div>

                    <div className="mb-8 text-center">
                        <p className="text-gray-600 text-lg">{status.message}</p>

                        {isSuccess ? (
                            <p className="mt-3 text-base text-emerald-600">
                                Bạn có thể làm mới trang Pro sau vài giây nếu chưa thấy gói được kích hoạt.
                            </p>
                        ) : (
                            <p className="mt-3 text-base text-gray-500">
                                Nếu bạn gặp vấn đề khi thanh toán, vui lòng thử lại sau hoặc chọn phương thức khác.
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        {!isSuccess && (
                            <Link
                                to="/pricing"
                                className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-gray-200 text-gray-700 text-base font-medium hover:bg-gray-50 transition"
                            >
                                Thử lại sau
                            </Link>
                        )}

                        <Link
                            to="/"
                            className={`w-full sm:w-auto px-5 py-2.5 rounded-full text-base font-semibold shadow-md hover:shadow-lg transition
                ${isSuccess
                                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                                    : "bg-[#8b5cf6] hover:bg-[#7c3aed] text-white"
                                }`}
                        >
                            Quay về trang chính
                        </Link>
                    </div>
                </div>

                <div className="mt-6 text-center text-sm text-gray-400">
                    Mã thanh toán được xử lý thông qua MoMo – vui lòng không chia sẻ thông tin giao dịch cho người khác.
                </div>
            </div>
        </div>
    );
};

export default MomoReturn;
