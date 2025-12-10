const ProfileHeader = ({
    initials,
    fullName,
    email,
    role,
    mobile,
    grammarCount,
    wordChoiceCount,
    plan,
    proExpiresAt,
    dailyUsage,
}) => {
    const isPro = plan === "pro";
    const usageCount = dailyUsage?.count ?? 0;
    const usageLimit = dailyUsage?.limit ?? 5;

    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            {/* Avatar + tên + email */}
            <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-[#CDEBE5] flex items-center justify-center text-2xl font-semibold text-slate-700">
                    {initials || "U"}
                </div>

                <div className="flex flex-col gap-1">
                    <div className="flex items-center flex-wrap gap-2">
                        <h2 className="text-xl font-semibold text-slate-900">
                            {fullName || "Người dùng GrammarlyAI"}
                        </h2>

                        {/* gói Pro / Free */}
                        {isPro ? (
                            <span className="px-3 py-[3px] text-xs font-semibold rounded-full bg-[#26A69A]/15 text-[#1F776D] border border-[#26A69A]/40">
                                Gói Pro
                            </span>
                        ) : (
                            <span className="px-3 py-[3px] text-xs font-medium rounded-full bg-slate-100 text-slate-600 border border-slate-300">
                                Gói Free
                            </span>
                        )}
                    </div>

                    <p className="text-sm text-slate-600">{email}</p>

                    {/* Vai trò + SĐT */}
                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600 mt-1">
                        <span>
                            <span className="font-medium text-slate-700">Vai trò: </span>
                            {role || "Người dùng"}
                        </span>
                        <span className="hidden md:inline-block w-1px h-4 bg-slate-300" />
                        <span>
                            <span className="font-medium text-slate-700">Số điện thoại: </span>
                            {mobile || "Chưa cập nhật"}
                        </span>
                    </div>

                    {/* Thông tin lượt kiểm tra */}
                    <div className="mt-2 text-xs text-slate-500">
                        {isPro ? (
                            <span>
                                Bạn đang sử dụng{" "}
                                <span className="font-semibold text-[#1F776D]">gói Pro</span> –{" "}
                                không giới hạn số lượt kiểm tra mỗi ngày.
                            </span>
                        ) : (
                            <span>
                                Lượt kiểm tra miễn phí hôm nay:{" "}
                                <span className="font-semibold text-slate-800">
                                    {usageCount} / {usageLimit}
                                </span>
                            </span>
                        )}
                    </div>

                    {/* Thời hạn Pro nếu có */}
                    {isPro && proExpiresAt && (
                        <div className="mt-1 text-xs text-slate-500">
                            Hạn sử dụng gói Pro đến:{" "}
                            <span className="font-semibold text-slate-700">
                                {new Date(proExpiresAt).toLocaleDateString("vi-VN")}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Thống kê lỗi */}
            <div className="bg-[#F1FAF8] border border-[#D7EBE6] rounded-xl px-4 py-3 text-sm min-w-[210px] shadow-sm">
                <p className="font-semibold text-slate-700 mb-2">Thống kê lỗi</p>
                <div className="flex justify-between items-center gap-3">
                    <span className="text-slate-500">Lỗi ngữ pháp</span>
                    <span className="font-semibold text-right">{grammarCount}</span>
                </div>
                <div className="flex justify-between items-center gap-3 mt-1">
                    <span className="text-slate-500">Lỗi dùng từ</span>
                    <span className="font-semibold text-right">{wordChoiceCount}</span>
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;
