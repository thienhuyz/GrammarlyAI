const ProfileForm = ({
    formData,
    isEditing,
    isLoading,
    current,
    onChange,
    onCancel,
    onSubmit,
    onStartEdit,
}) => {
    return (
        <>
            <div className="border-t border-dashed border-[#E2F1EC] pt-4 mt-2 flex items-center justify-between gap-3">
                <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                        Thông tin cá nhân
                    </h3>
                    <p className="text-sm text-slate-500">
                        Xem và chỉnh sửa thông tin hồ sơ của bạn.
                    </p>
                </div>
                {!isEditing && (
                    <button
                        type="button"
                        onClick={onStartEdit}
                        className="px-4 py-2 rounded-full text-sm font-medium border border-[#4DB6AC] text-[#0F766E] hover:bg-[#E0F2F1] transition"
                    >
                        Chỉnh sửa
                    </button>
                )}
            </div>

            {isLoading && (
                <div className="text-sm text-slate-500">
                    Đang tải thông tin người dùng...
                </div>
            )}

            {!isLoading && !current && (
                <div className="text-sm text-red-500">
                    Không tìm thấy thông tin người dùng.
                </div>
            )}

            {!isLoading && current && (
                <form
                    onSubmit={onSubmit}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                    <div className="flex flex-col gap-1">
                        <label
                            htmlFor="firstname"
                            className="text-sm font-medium text-slate-700"
                        >
                            Họ
                        </label>
                        <input
                            id="firstname"
                            name="firstname"
                            type="text"
                            className="border border-[#C7E5DF] rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#4DB6AC] bg-white"
                            value={formData.firstname}
                            onChange={onChange}
                            disabled={!isEditing}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label
                            htmlFor="lastname"
                            className="text-sm font-medium text-slate-700"
                        >
                            Tên
                        </label>
                        <input
                            id="lastname"
                            name="lastname"
                            type="text"
                            className="border border-[#C7E5DF] rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#4DB6AC] bg-white"
                            value={formData.lastname}
                            onChange={onChange}
                            disabled={!isEditing}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label
                            htmlFor="email"
                            className="text-sm font-medium text-slate-700"
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            className="border border-[#C7E5DF] rounded-xl px-3 py-2 text-sm outline-none bg-slate-100 cursor-not-allowed"
                            value={formData.email}
                            disabled
                        />
                        <span className="text-[11px] text-slate-400">
                            Email không thể thay đổi.
                        </span>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label
                            htmlFor="mobile"
                            className="text-sm font-medium text-slate-700"
                        >
                            Số điện thoại
                        </label>
                        <input
                            id="mobile"
                            name="mobile"
                            type="text"
                            className="border border-[#C7E5DF] rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#4DB6AC] bg-white"
                            value={formData.mobile}
                            onChange={onChange}
                            disabled={!isEditing}
                        />
                    </div>

                    {isEditing && (
                        <div className="md:col-span-2 flex justify-end gap-3 mt-2">
                            <button
                                type="button"
                                onClick={onCancel}
                                className="px-4 py-2 rounded-full text-sm border border-slate-300 text-slate-600 hover:bg-slate-100 transition"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 rounded-full text-sm font-medium bg-[#26A69A] text-white hover:bg-[#1F9388] transition"
                            >
                                Lưu thay đổi
                            </button>
                        </div>
                    )}
                </form>
            )}
        </>
    );
};

export default ProfileForm;
