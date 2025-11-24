import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, InputField } from "../../components";
import { apiResetPassword } from "../../apis/user";
import Swal from "sweetalert2";
import { isValidPassword } from "../../utils/validate";
import path from "../../utils/path";

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        password: "",
        confirmPassword: "",
    });

    const handleReset = async () => {
        if (!form.password || !form.confirmPassword) {
            Swal.fire("Lỗi", "Vui lòng nhập đầy đủ mật khẩu.", "error");
            return;
        }

        if (!isValidPassword(form.password)) {
            Swal.fire("Lỗi", "Mật khẩu phải có ít nhất 6 ký tự.", "error");
            return;
        }

        if (form.password !== form.confirmPassword) {
            Swal.fire("Lỗi", "Mật khẩu xác nhận không khớp.", "error");
            return;
        }

        const res = await apiResetPassword({ token, password: form.password });

        if (res.success) {
            Swal.fire("Thành công", res.mes, "success").then(() => {
                navigate(`/${path.LOGIN}`)
            });
        } else {
            Swal.fire("Lỗi", res.mes, "error");
        }
    };

    return (
        <div className="w-full min-h-screen flex justify-center items-center bg-[#F5FFFD] px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-[#016A5E]/20">
                <h1 className="text-3xl font-bold mb-6 text-center text-[#016A5E]">
                    Đặt lại mật khẩu
                </h1>

                <InputField
                    label="Mật khẩu mới"
                    nameKey="password"
                    type="password"
                    value={form.password}
                    setValue={setForm}
                />

                <InputField
                    label="Xác nhận mật khẩu"
                    nameKey="confirmPassword"
                    type="password"
                    value={form.confirmPassword}
                    setValue={setForm}
                />

                <Button
                    onClick={handleReset}
                    className="w-full"
                >
                    Xác nhận
                </Button>
            </div>
        </div>
    );
}


export default ResetPassword
