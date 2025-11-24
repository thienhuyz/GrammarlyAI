import {
    DocumentTextIcon,
    ClockIcon,
    TrashIcon,
    UserIcon,
    QuestionMarkCircleIcon,
    PowerIcon,
    ChevronLeftIcon,
    ChevronRightIcon
} from "../../utils/icon";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { getCurrent } from "../../store/asyncActions";
import { logout } from "../../store/userSlice";
import { apiLogout } from "../../apis";
import path from "../../utils/path";

const Sidebar = ({ isOpen, onToggle }) => {
    const itemClass =
        "flex items-center gap-3 py-4 rounded-lg cursor-pointer select-none transition-colors hover:bg-gray-100";

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { current, token } = useSelector((state) => state.user);

    useEffect(() => {
        if (token) {
            dispatch(getCurrent());
        }
    }, [token]);


    const userEmail = current?.email;

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
        border-r border-gray-200
        shadow-[1px_0_4px_rgba(0,0,0,0.12)]
        bg-white
        ${isOpen ? "w-64" : "w-16"}
    `}
        >
            <button
                onClick={onToggle}
                className="
                    absolute -right-6 top-4
                    h-10 w-10 rounded-full border border-gray-300 bg-white
                    flex items-center justify-center shadow-md 
                "
            >
                {isOpen ? (
                    <ChevronLeftIcon className="h-6 w-6 cursor-pointer" />
                ) : (
                    <ChevronRightIcon className="h-6 w-6 cursor-pointer" />
                )}
            </button>
            {/* Menu trên */}
            <nav className="space-y-1 px-2">
                <div className={`${itemClass} ${isOpen ? "px-3" : "px-0 justify-center"}`}>
                    <DocumentTextIcon className="h-5 w-5" />
                    {isOpen && <span>Tài liệu</span>}
                </div>

                <div className={`${itemClass} ${isOpen ? "px-3" : "px-0 justify-center"}`}>
                    <TrashIcon className="h-5 w-5" />
                    {isOpen && <span>Thùng rác</span>}
                </div>

                <div className={`${itemClass} ${isOpen ? "px-3" : "px-0 justify-center"}`}>
                    <UserIcon className="h-5 w-5" />
                    {isOpen && <span>Tài khoản</span>}
                </div>
            </nav>

            {/* Menu dưới */}
            <div className="mt-auto px-2 pt-4 border-t border-gray-200">
                <div className={`${itemClass} ${isOpen ? "px-3" : "px-0 justify-center"}`}>
                    <QuestionMarkCircleIcon className="h-5 w-5" />
                    {isOpen && <span>Hỗ trợ</span>}
                </div>

                <div
                    className={`${itemClass} mt-4 ${isOpen ? "px-3" : "px-0 justify-center"}`}
                    onClick={handleLogout}
                >
                    <PowerIcon className="h-5 w-5 shrink-0" />
                    {isOpen && (
                        <div className="flex flex-col leading-tight min-w-0">
                            <span>Đăng xuất</span>
                            <span className="text-xs text-gray-500 truncate">
                                {userEmail}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
