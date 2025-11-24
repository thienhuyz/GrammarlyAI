import { useRef, useState, useEffect } from "react";
import { Sidebar } from "../../components";
import {
    EllipsisVerticalIcon,
    ArrowUturnLeftIcon,
    ArrowUturnRightIcon,
    ArrowDownOnSquareStackIcon,
    TrashIcon,
} from "../../utils/icon";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import path from "../../utils/path";


const Editor = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [docTitle, setDocTitle] = useState("Tài liệu không tên");

    const editorRef = useRef(null);
    const navigate = useNavigate();
    const { isLoggedIn } = useSelector(state => state.user);
    useEffect(() => {
        if (!isLoggedIn) {

            navigate(`/${path.HOME}`)
        }
    }, [isLoggedIn]);

    const handleUndo = () => document.execCommand("undo");
    const handleRedo = () => document.execCommand("redo");


    const handleSave = () => {
        if (!editorRef.current) return;

        const content = editorRef.current.innerHTML;

        const name = window.prompt("Đặt tên tài liệu:", docTitle);
        if (!name) return;

        setDocTitle(name);
        localStorage.setItem(`doc-${name}`, content);
        alert("Đã lưu tài liệu (demo) vào LocalStorage.");
    };

    const handleDelete = () => {
        if (!editorRef.current) return;
        if (window.confirm("Bạn có chắc muốn xóa toàn bộ nội dung tài liệu không?")) {
            editorRef.current.innerHTML = "";
        }
    };

    return (
        <div className="h-[calc(100vh-72px)] w-full flex bg-[#f5f7fb] text-slate-900">
            <Sidebar
                isOpen={isSidebarOpen}
                onToggle={() => setIsSidebarOpen(prev => !prev)}
            />

            <main className="flex-1 flex overflow-hidden">
                <div className="flex-1 relative">

                    {/*soạn thảo */}
                    <div
                        ref={editorRef}
                        contentEditable
                        suppressContentEditableWarning
                        className="
                            w-full h-full
                            bg-white border border-gray-200 shadow
                            outline-none text-left leading-relaxed
                            p-16
                        "
                    ></div>

                    {/* Nút 3 chấm */}
                    <div className="absolute top-5 right-6 z-50">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="h-9 w-9 rounded-full border border-gray-300 bg-white flex items-center justify-center shadow hover:bg-gray-50"
                        >
                            <EllipsisVerticalIcon className="h-5 w-5" />
                        </button>

                        {isMenuOpen && (
                            <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-lg border border-gray-200 py-1 text-sm z-50">

                                {/* Hoàn tác */}
                                <button
                                    onClick={handleUndo}
                                    className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-50"
                                >
                                    <span className="flex items-center gap-2">
                                        <ArrowUturnLeftIcon className="h-4 w-4" />
                                        Hoàn tác
                                    </span>
                                    <span className="text-xs text-gray-400">Ctrl Z</span>
                                </button>

                                {/* Làm lại */}
                                <button
                                    onClick={handleRedo}
                                    className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-50"
                                >
                                    <span className="flex items-center gap-2">
                                        <ArrowUturnRightIcon className="h-4 w-4" />
                                        Làm lại
                                    </span>
                                    <span className="text-xs text-gray-400">Ctrl Y</span>
                                </button>

                                <div className="my-1 h-px bg-gray-100"></div>


                                {/* Lưu tài liệu */}
                                <button
                                    onClick={handleSave}
                                    className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-50"
                                >
                                    <span className="flex items-center gap-2">
                                        <ArrowDownOnSquareStackIcon className="h-4 w-4" />
                                        Lưu tài liệu
                                    </span>
                                </button>

                                <div className="my-1 h-px bg-gray-100"></div>

                                {/* Xóa tài liệu */}
                                <button
                                    onClick={handleDelete}
                                    className="w-full flex items-center justify-between px-3 py-2 hover:bg-red-50 text-red-600"
                                >
                                    <span className="flex items-center gap-2">
                                        <TrashIcon className="h-4 w-4" />
                                        Xóa tài liệu
                                    </span>
                                </button>
                            </div>
                        )}

                    </div>
                </div>
            </main>
        </div>
    );
};

export default Editor;
