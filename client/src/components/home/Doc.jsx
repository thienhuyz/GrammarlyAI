import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { Button, Sidebar } from "../../components";

import {
    PlusCircleIcon,
    ChevronDownIcon,
    ArrowUpTrayIcon,
} from "../../utils/icon";

const Doc = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const handleUpload = (e) => {
        const file = e.target.files[0];
        console.log("File tải lên:", file);
    };

    return (
        <div className="h-[calc(100vh-72px)] w-full flex bg-white text-slate-900">
            <Sidebar
                isOpen={isSidebarOpen}
                onToggle={() => setIsSidebarOpen(prev => !prev)}
            />

            <main className="flex-1 flex flex-col relative">
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                    <h2 className="text-3xl font-semibold mb-3">Chưa có tài liệu nào</h2>
                    <p className="text-sm text-gray-500 mb-8">
                        Tạo tài liệu mới hoặc tải lên tệp từ thiết bị của bạn.
                    </p>

                    <div className="flex items-center gap-3">

                        <Button
                            onClick={() => navigate("/editor")}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium w-auto"
                        >
                            <PlusCircleIcon className="h-5 w-5" />
                            <span>Tài liệu mới</span>
                            <ChevronDownIcon className="h-4 w-4" />
                        </Button>

                        <Button
                            onClick={() => fileInputRef.current?.click()}
                            className="
                                inline-flex items-center gap-2
                                px-5 py-2.5 rounded-full text-sm font-medium 
                                w-auto
                            "
                        >
                            <ArrowUpTrayIcon className="h-4 w-4" />
                            <span>Tải lên</span>
                            <ChevronDownIcon className="h-4 w-4" />
                        </Button>

                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept=".doc,.docx,.pdf"
                            onChange={handleUpload}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Doc;
