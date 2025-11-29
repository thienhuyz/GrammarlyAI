import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Sidebar } from "../../components";
import path from "../../utils/path";
import { apiCheckGrammar, apiUpdateErrorStats } from "../../apis";
import { toast } from "react-toastify";
import { InputArea, CorrectedPanel, ErrorListPanel } from "../../components";
import jsPDF from "jspdf";
import { useDispatch } from "react-redux";
import { getCurrent } from "../../store/asyncActions";

const TYPE_LABELS = {
    grammar: "Ngữ pháp",
    word_choice: "Từ vựng",
};
const countErrorsByType = (corrections = []) => {
    let grammar = 0;
    let word_choice = 0;

    corrections.forEach((item) => {
        if (item.type === "grammar") grammar += 1;
        if (item.type === "word_choice") word_choice += 1;
    });

    return { grammar, word_choice };
};
const Editor = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const navigate = useNavigate();
    const location = useLocation();
    const { isLoggedIn } = useSelector((state) => state.user);

    const [text, setText] = useState("");
    const [aiResult, setAiResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(null);

    const MAX_WORDS = 200;
    const editorRef = useRef(null);
    const dispatch = useDispatch();
    useEffect(() => {
        if (!isLoggedIn) {
            navigate(`/${path.HOME}`);
        }
    }, [isLoggedIn, navigate]);

    useEffect(() => {
        const initialText = location.state?.initialText;
        if (!initialText) return;

        const words = initialText.trim().split(/\s+/);
        let finalText = initialText;

        if (words.length > MAX_WORDS) {
            const limited = words.slice(0, MAX_WORDS).join(" ");

            toast.warn(`Nội dung ban đầu vượt quá ${MAX_WORDS} từ, đã cắt bớt.`, {
                position: "top-right",
                autoClose: 2000,
            });

            finalText = limited;
        }

        setText(finalText);

        if (editorRef.current) {
            editorRef.current.innerHTML = finalText.replace(/\n/g, "<br/>");
        }
    }, [location.state?.initialText]);


    const getWordCount = (value) => {
        if (!value.trim()) return 0;
        return value.trim().split(/\s+/).length;
    };

    const wordCount = getWordCount(text);
    const hasCorrected = !!aiResult?.corrected;

    // Ngữ pháp
    const handleCheckGrammar = async () => {
        try {
            setLoading(true);
            setError("");
            setAiResult(null);
            setSelectedIndex(null);

            const res = await apiCheckGrammar({ text });

            if (!res?.success) {
                const msg = res?.mes || "Lỗi không xác định";
                setError(msg);
                throw new Error(msg);
            }

            const data = res.data;
            setAiResult(data);

            const corrections = data?.corrections || [];
            const { grammar, word_choice } = countErrorsByType(corrections);

            if (grammar > 0 || word_choice > 0) {
                try {
                    const updateRes = await apiUpdateErrorStats({ grammar, word_choice });
                    if (updateRes?.success) {
                        dispatch(getCurrent());
                    }
                } catch (err) {
                    console.log("Không cập nhật thống kê lỗi:", err.message);
                }
            }
        } catch (err) {
            const msg = err?.message || "Đã xảy ra lỗi khi kiểm tra ngữ pháp.";
            setError(msg);
            toast.error(msg, {
                position: "top-right",
                autoClose: 2500,
            });
        } finally {
            setLoading(false);
        }
    };


    // Xóa 
    const handleClear = () => {
        setText("");
        setAiResult(null);
        setError("");
        setSelectedIndex(null);
        if (editorRef.current) editorRef.current.innerText = "";
        toast.success("Đã xóa nội dung.", {
            position: "top-right",
            autoClose: 1500,
        });
    };

    // Sao chép 
    const handleCopy = async () => {
        if (!aiResult?.corrected) return;

        if (!navigator?.clipboard) {
            toast.error("Trình duyệt không hỗ trợ sao chép.", {
                position: "top-right",
                autoClose: 2000,
            });
            return;
        }

        try {
            await navigator.clipboard.writeText(aiResult.corrected);
            toast.success("Văn bản đã được sao chép", {
                position: "top-right",
                autoClose: 2000,
            });
        } catch {
            toast.error("Không thể sao chép. Vui lòng thử lại.", {
                position: "top-right",
                autoClose: 2000,
            });
        }
    };

    //Lưu
    const handleDownload = () => {
        const corrected = aiResult?.corrected;
        if (!corrected) return;

        const doc = new jsPDF();
        const marginLeft = 10;
        const marginTop = 15;
        const maxWidth = 190;

        const lines = doc.splitTextToSize(corrected, maxWidth);

        doc.text(lines, marginLeft, marginTop);
        doc.save("corrected-text.pdf");

        toast.success("Đã tải xuống file PDF!", {
            position: "top-right",
            autoClose: 2000,
        });
    };



    return (
        <div className="h-[calc(100vh-72px)] w-full flex bg-[#E6F4F1] text-slate-900">
            <Sidebar
                isOpen={isSidebarOpen}
                onToggle={() => setIsSidebarOpen((prev) => !prev)}
            />

            <main className="flex-1 flex overflow-hidden">
                <div className="flex-1 flex flex-col min-h-0">
                    <div className="flex-1 flex bg-[#F5FBFA] border-l border-t border-[#B8E0DB] rounded-tr-2xl rounded-b-2xl shadow-sm min-h-0">

                        {/* LEFT */}
                        <div className="flex-1 flex flex-col border-r border-[#C7E5DF] py-4 px-8 min-h-0">
                            <div className="flex-1 flex flex-col gap-4 min-h-0">
                                <InputArea
                                    text={text}
                                    setText={setText}
                                    wordCount={wordCount}
                                    aiResult={aiResult}
                                    editorRef={editorRef}
                                />

                                <CorrectedPanel
                                    aiResult={aiResult}
                                    loading={loading}
                                    error={error}
                                    hasCorrected={hasCorrected}
                                    text={text}
                                    onCheckGrammar={handleCheckGrammar}
                                    onCopy={handleCopy}
                                    onDownload={handleDownload}
                                    onClear={handleClear}
                                />
                            </div>
                        </div>

                        {/* RIGHT */}
                        <ErrorListPanel
                            aiResult={aiResult}
                            loading={loading}
                            error={error}
                            selectedIndex={selectedIndex}
                            setSelectedIndex={setSelectedIndex}
                            typeLabels={TYPE_LABELS}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Editor;
