import {
    DocumentTextIcon, UserIcon, QuestionMarkCircleIcon, PowerIcon,
    ChevronLeftIcon, ChevronRightIcon, PhoneIcon, EnvelopeIcon, LockClosedIcon
} from "../../utils/icon";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { getCurrent } from "../../store/asyncActions";
import { logout } from "../../store/userSlice";
import { apiLogout } from "../../apis";
import path from "../../utils/path";
import { toast } from "react-toastify";

const Sidebar = ({ isOpen, onToggle }) => {
    const baseItemClass =
        "flex items-center gap-3 py-3 rounded-lg cursor-pointer select-none transition-colors text-sm text-[#016A5E]";
    const itemHoverClass = "hover:bg-[#E6F4F1]";

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { current, token } = useSelector((state) => state.user);
    const isPro = current?.plan === "pro";

    useEffect(() => {
        if (token) {
            dispatch(getCurrent());
        }
    }, [token, dispatch]);

    const userEmail = current?.email;
    const isAdmin = current?.role === "admin";
    const [showSupport, setShowSupport] = useState(false);

    const handleLogout = async () => {
        try {
            await apiLogout();
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            dispatch(logout());
            navigate(path.PUBLIC);
        }
    };

    return (
        <aside
            className={`
                h-full flex flex-col py-4 relative
                transition-all duration-300 z-30
                border-r border-[#D4ECE7]
                shadow-[1px_0_4px_rgba(1,106,94,0.12)]
                bg-[#F5FBFA]
                ${isOpen ? "w-64" : "w-16"}
            `}
        >
            {/* Toggle icon */}
            <button
                onClick={onToggle}
                className="absolute -right-5 top-4 h-9 w-9 rounded-full border border-[#D4ECE7] bg-white
                    flex items-center justify-center shadow-sm hover:bg-[#F5FBFA] transition cursor-pointer"
            >
                {isOpen ? (
                    <ChevronLeftIcon className="h-5 w-5 text-[#016A5E]" />
                ) : (
                    <ChevronRightIcon className="h-5 w-5 text-[#016A5E]" />
                )}
            </button>

            {/* Menu trên */}
            <nav className="space-y-1 px-2 mt-2">

                {/* NGỮ PHÁP */}
                <div
                    onClick={() => navigate(`/${path.EDITOR}`)}
                    className={`
                        ${baseItemClass} ${itemHoverClass}
                        ${isOpen ? "px-3" : "px-0 justify-center"}
                    `}
                >
                    <DocumentTextIcon className="h-5 w-5 text-[#016A5E]" />
                    {isOpen && <span>Ngữ pháp</span>}
                </div>

                {/* TÀI KHOẢN */}
                <div
                    onClick={() => navigate(`/${path.PROFILE}`)}
                    className={`
                        ${baseItemClass} ${itemHoverClass}
                        ${isOpen ? "px-3" : "px-0 justify-center"}
                    `}
                >
                    <UserIcon className="h-5 w-5 text-[#016A5E]" />
                    {isOpen && <span>Tài khoản</span>}
                </div>

                <div
                    onClick={() => {
                        if (!isPro) {


                            navigate(`/${path.PRICING}`);

                            toast.info("Vui lòng nâng cấp Pro để sử dụng tính năng xem lịch sử.", {
                                position: "top-right",
                                autoClose: 3000,
                            });


                            return;
                        }

                        navigate(`/${path.HISTORY}`);
                    }}
                    className={`
        ${baseItemClass} ${itemHoverClass}
        ${isOpen ? "px-3" : "px-0 justify-center"}
        ${!isPro ? "opacity-80" : ""}
    `}
                >
                    <DocumentTextIcon className="h-5 w-5 text-[#016A5E]" />
                    {isOpen && (
                        <span className="flex items-center gap-2">
                            Lịch sử
                            {!isPro && (
                                <LockClosedIcon className="h-4 w-4 text-[#016A5E]" />
                            )}
                        </span>
                    )}
                </div>


                {isAdmin && (
                    <div
                        onClick={() => navigate(`/${path.ADMIN}`)}
                        className={`
                            ${baseItemClass} ${itemHoverClass}
                            ${isOpen ? "px-3" : "px-0 justify-center"}
                        `}
                    >
                        <DocumentTextIcon className="h-5 w-5 text-[#016A5E]" />
                        {isOpen && <span>Trang admin</span>}
                    </div>
                )}
            </nav>

            {/* Menu dưới */}
            <div className="mt-auto px-2 pt-4 border-t border-[#D4ECE7]">

                {/* HỖ TRỢ */}
                <div
                    onClick={() => setShowSupport(!showSupport)}
                    className={`${baseItemClass} ${itemHoverClass} ${isOpen ? "px-3" : "px-0 justify-center"
                        }`}
                >
                    <QuestionMarkCircleIcon className="h-5 w-5 text-[#016A5E]" />
                    {isOpen && <span>Hỗ trợ</span>}
                </div>

                {showSupport && isOpen && (
                    <div className="mt-1 bg-white border border-[#D4ECE7] rounded-lg p-3 shadow text-sm text-[#016A5E] space-y-2">

                        <div className="flex items-center gap-2">
                            <PhoneIcon className="h-4 w-4 text-[#016A5E]" />
                            <span>0900 123 456</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <EnvelopeIcon className="h-4 w-4 text-[#016A5E]" />
                            <span>support@gmail.com</span>
                        </div>

                    </div>
                )}


                {/* ĐĂNG XUẤT */}
                <div
                    onClick={handleLogout}
                    className={`
                        ${baseItemClass} mt-4 ${itemHoverClass}
                        ${isOpen ? "px-3" : "px-0 justify-center"}
                    `}
                >
                    <PowerIcon className="h-5 w-5 shrink-0 text-[#E11D48]" />
                    {isOpen && (
                        <div className="flex flex-col leading-tight min-w-0">
                            <span className="text-[#E11D48] font-medium">Đăng xuất</span>
                            <span className="text-xs text-slate-500 truncate">{userEmail}</span>
                        </div>
                    )}
                </div>

            </div>
        </aside>


    );
};

export default Sidebar;
