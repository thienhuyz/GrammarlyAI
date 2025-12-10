import { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../../components";
import path from "../../utils/path";
import { toast } from "react-toastify";
import { apiUpdateCurrent } from "../../apis";
import { getCurrent } from "../../store/asyncActions";
import { ProfileHeader, ProfileForm } from "../../components";


const Profile = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isLoggedIn, current, isLoading } = useSelector((state) => state.user);

    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        mobile: "",
    });

    const grammarCount = current?.errorStats?.grammar ?? 0;
    const wordChoiceCount = current?.errorStats?.word_choice ?? 0;

    useEffect(() => {
        if (!isLoggedIn) {
            navigate(`/${path.HOME}`);
        }
    }, [isLoggedIn, navigate]);

    useEffect(() => {
        if (current) {
            setFormData({
                firstname: current.firstname || "",
                lastname: current.lastname || "",
                email: current.email || "",
                mobile: current.mobile || "",
            });
        }
    }, [current]);

    const initials = useMemo(() => {
        if (!current) return "";
        const f = current.firstname?.[0] || "";
        const l = current.lastname?.[0] || "";
        return (f + l).toUpperCase();
    }, [current]);

    const fullName = useMemo(() => {
        if (!current) return "";
        return `${current.firstname || ""} ${current.lastname || ""}`.trim();
    }, [current]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCancel = () => {
        if (!current) return;
        setFormData({
            firstname: current.firstname || "",
            lastname: current.lastname || "",
            email: current.email || "",
            mobile: current.mobile || "",
        });
        setIsEditing(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const payload = {
                firstname: formData.firstname,
                lastname: formData.lastname,
                mobile: formData.mobile,
            };

            const response = await apiUpdateCurrent(payload);

            if (response?.success) {
                toast.success(response?.mes || "Cập nhật thông tin thành công!", {
                    position: "top-right",
                    autoClose: 2000,
                });
                dispatch(getCurrent());
                setIsEditing(false);
            } else {
                toast.error(
                    response?.mes || "Cập nhật thông tin thất bại, vui lòng thử lại.",
                    { position: "top-right", autoClose: 2500 }
                );
            }
        } catch (err) {
            toast.error(
                err?.response?.data?.mes || "Có lỗi xảy ra khi cập nhật, vui lòng thử lại.",
                { position: "top-right", autoClose: 2500 }
            );
        }
    };

    return (
        <div className="h-[calc(100vh-72px)] w-full flex bg-[#E6F4F1] text-slate-900">
            <Sidebar
                isOpen={isSidebarOpen}
                onToggle={() => setIsSidebarOpen((prev) => !prev)}
            />

            <main className="flex-1 flex overflow-hidden">
                <div className="flex-1 flex flex-col min-h-0">
                    <div className="flex-1 flex bg-[#F5FBFA] border-l border-t border-[#B8E0DB] rounded-tr-2xl rounded-b-2xl shadow-sm min-h-0 py-6 md:py-8">
                        <div className="w-full max-w-4xl mx-auto px-4">
                            <section className="w-full bg-white/80 border border-[#C7E5DF] rounded-2xl shadow-sm p-6 md:p-8 flex flex-col gap-6">

                                <ProfileHeader
                                    initials={initials}
                                    fullName={fullName}
                                    email={current?.email}
                                    role={current?.role}
                                    mobile={current?.mobile}
                                    grammarCount={grammarCount}
                                    wordChoiceCount={wordChoiceCount}
                                    plan={current?.plan}
                                    proExpiresAt={current?.proExpiresAt}
                                    dailyUsage={current?.dailyUsage}
                                />


                                <ProfileForm
                                    formData={formData}
                                    isEditing={isEditing}
                                    isLoading={isLoading}
                                    current={current}
                                    onChange={handleChange}
                                    onCancel={handleCancel}
                                    onSubmit={handleSubmit}
                                    onStartEdit={() => setIsEditing(true)}
                                />
                            </section>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Profile;
