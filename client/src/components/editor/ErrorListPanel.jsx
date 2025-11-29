import { HashLoader } from "react-spinners";
import logo from "../../assets/logo.png";

const ErrorListPanel = ({
    aiResult,
    loading,
    error,
    selectedIndex,
    setSelectedIndex,
    typeLabels,
}) => {
    return (
        <div className="w-[40%] min-w-[260px] flex flex-col bg-[#E0F5F2] border-l border-[#B8E0DB] p-6 min-h-0">
            {!aiResult && !error && !loading && (
                <div className="flex flex-col items-center justify-center flex-1 text-sm text-slate-700">
                    <img src={logo} alt="logo" className="w-20 h-20 mb-3" />
                    <h2 className="font-semibold mb-1 text-[#016A5E]"> Các lỗi và giải thích chi tiết sẽ hiển thị ở bên đây.</h2>
                </div>
            )}

            {loading && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-9999">
                    <HashLoader size={60} color="#016A5E" />
                </div>
            )}

            {error && (
                <p className="text-sm text-red-600 items-center justify-center">
                    {error}
                </p>
            )}

            {aiResult && !loading && !error && (
                <div className="flex-1 overflow-y-auto flex flex-col gap-4 text-sm pr-1">
                    {aiResult.corrections?.length > 0 ? (
                        <div className="space-y-2">
                            {aiResult.corrections.map((item, idx) => {
                                const isActive = selectedIndex === idx;
                                return (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() =>
                                            setSelectedIndex(isActive ? null : idx)
                                        }
                                        className={`w-full text-left rounded-2xl p-3 border bg-white/90 shadow-sm transition cursor-pointer ${isActive
                                            ? "border-[#016A5E] bg-[#F5FBFA]"
                                            : "border-[#C7E5DF]"
                                            }`}
                                    >
                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                            <span className="h-2 w-2 rounded-full bg-[#016A5E]" />

                                            <span className="px-2 py-1 rounded-md bg-orange-100 text-orange-700 text-sm line-through">
                                                {item.original}
                                            </span>

                                            <span className="text-slate-400 text-sm">→</span>

                                            <span className="px-3 py-1 rounded-full bg-[#016A5E] text-white text-sm font-medium">
                                                {item.correct}
                                            </span>

                                            {item.type && (
                                                <span className="ml-2 px-2 py-0.5 rounded-full bg-[#E6F4F1] text-[11px] text-[#016A5E] border border-[#B8E0DB]">
                                                    {typeLabels[item.type] || item.type}
                                                </span>
                                            )}
                                        </div>

                                        {isActive && item.explanation && (
                                            <p className="mt-1 text-sm text-slate-700 leading-snug">
                                                {item.explanation}
                                            </p>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-sm text-slate-700">
                            Không phát hiện lỗi nào.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default ErrorListPanel;
