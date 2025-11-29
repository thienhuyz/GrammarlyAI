const ProfileHeader = ({
    initials,
    fullName,
    email,
    role,
    mobile,
    grammarCount,
    wordChoiceCount,
}) => {
    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            {/* Avatar + tên + email */}
            <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-[#CDEBE5] flex items-center justify-center text-2xl font-semibold text-slate-700">
                    {initials || "U"}
                </div>
                <div className="space-y-1">
                    <h2 className="text-xl font-semibold text-slate-900">
                        {fullName || "User"}
                    </h2>
                    <p className="text-sm text-slate-500 break-all">
                        {email || "Chưa cập nhật email"}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                        <span>
                            Vai trò:{" "}
                            <span className="font-semibold uppercase text-slate-700">
                                {role || "user"}
                            </span>
                        </span>
                        <span>
                            Số điện thoại:{" "}
                            <span className="font-semibold text-slate-700">
                                {mobile || "Chưa cập nhật"}
                            </span>
                        </span>
                    </div>
                </div>
            </div>

            {/* Thống kê lỗi */}
            <div className="bg-[#F1FAF8] border border-[#D7EBE6] rounded-xl px-4 py-3 text-sm min-w-[190px]">
                <p className="font-semibold text-slate-700 mb-2">
                    Thống kê lỗi
                </p>
                <div className="flex justify-between items-center gap-3">
                    <span className="text-slate-500">Lỗi ngữ pháp</span>
                    <span className="font-semibold text-right">
                        {grammarCount}
                    </span>
                </div>
                <div className="flex justify-between items-center gap-3 mt-1">
                    <span className="text-slate-500">Lỗi dùng từ</span>
                    <span className="font-semibold text-right">
                        {wordChoiceCount}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;
