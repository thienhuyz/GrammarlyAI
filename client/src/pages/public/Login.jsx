import { useState } from "react";
import { InputField, Button, OTPInput } from "../../components";
import { apiRegister, apiLogin, apiVerifyOTP, apiResendOTP, apiForgotPassword } from '../../apis/user'
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import path from "../../utils/path";
import { login } from '../../store/userSlice'
import { useDispatch } from 'react-redux'
import { isValidEmail, isValidPhone, isValidPassword } from "../../utils/validate";
import { HashLoader } from "react-spinners";

const Login = () => {
    const location = useLocation();
    const mode = location.state?.mode;
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [isRegister, setIsRegister] = useState(mode === "register");

    const [payload, setPayload] = useState({
        email: "",
        password: "",
        firstname: "",
        lastname: "",
        mobile: "",
    });


    const [showOTP, setShowOTP] = useState(false);
    const [otp, setOtp] = useState("");
    const [verifyEmail, setVerifyEmail] = useState("");


    const [resendCount, setResendCount] = useState(1);
    const [cooldown, setCooldown] = useState(0);

    const [showForgot, setShowForgot] = useState(false);
    const [forgotEmail, setForgotEmail] = useState("");

    const [isLoading, setIsLoading] = useState(false);

    const resetPayload = () => {
        setPayload({
            email: "",
            password: "",
            firstname: "",
            lastname: "",
            mobile: "",
        })
    }


    const handleSubmit = async () => {
        const { firstname, lastname, mobile, ...data } = payload

        if (isRegister) {

            if (!payload.firstname || !payload.lastname) {
                Swal.fire("Lỗi", "Vui lòng nhập đầy đủ họ tên.", "error");
                return;
            }

            if (!isValidEmail(payload.email)) {
                Swal.fire("Lỗi", "Email không hợp lệ.", "error");
                return;
            }

            if (!isValidPhone(payload.mobile)) {
                Swal.fire("Lỗi", "Số điện thoại không hợp lệ.", "error");
                return;
            }

            if (!isValidPassword(payload.password)) {
                Swal.fire("Lỗi", "Mật khẩu phải có ít nhất 6 ký tự.", "error");
                return;
            }
            setIsLoading(true);

            const response = await apiRegister(payload)

            setIsLoading(false);

            if (response.success) {
                Swal.fire('Thành công', response.mes, 'success').then(() => {
                    setShowOTP(true)
                    setVerifyEmail(payload.email)
                    setResendCount(1)
                })
            } else Swal.fire('Lỗi', response.mes, 'error')

        } else {
            if (!isValidEmail(data.email)) {
                Swal.fire("Lỗi", "Email không hợp lệ.", "error");
                return;
            }

            if (!data.password) {
                Swal.fire("Lỗi", "Vui lòng nhập mật khẩu.", "error");
                return;
            }

            setIsLoading(true);

            const rs = await apiLogin(data)

            setIsLoading(false);

            if (rs.success) {
                dispatch(login({ isLoggedIn: true, token: rs.accessToken }))
                navigate(`/${path.HOME}`)
            } else Swal.fire('Lỗi', rs.mes, 'error')
        }

    }


    const handleVerifyOTP = async () => {

        setIsLoading(true)

        const res = await apiVerifyOTP({ email: verifyEmail, otp })

        setIsLoading(false);

        if (res.success) {
            Swal.fire('Thành công', "Xác thực tài khoản thành công!", 'success').then(() => {
                setShowOTP(false)
                setIsRegister(false)
                resetPayload()
            })
        } else {
            Swal.fire('Lỗi', res.mes, 'error')
        }
    }


    const handleResend = async () => {
        if (resendCount >= 3) {
            Swal.fire("Thông báo", "Bạn đã dùng hết số lần gửi lại OTP (3 lần).", "warning");
            return;
        }

        if (cooldown > 0) return;
        setIsLoading(true)

        const res = await apiResendOTP({ email: verifyEmail });

        setIsLoading(false);

        if (res.success) {
            Swal.fire("Thành công", res.mes, "success");
            setResendCount(resendCount + 1);

            setCooldown(30);
            const timer = setInterval(() => {
                setCooldown(prev => {
                    if (prev <= 1) clearInterval(timer);
                    return prev - 1;
                });
            }, 1000);

        } else {
            Swal.fire("Lỗi", res.mes, "error");
        }
    };

    const handleForgot = async () => {
        if (!isValidEmail(forgotEmail)) {
            Swal.fire("Lỗi", "Email không hợp lệ.", "error");
            return;
        }
        setIsLoading(true);

        const res = await apiForgotPassword({ email: forgotEmail });

        setIsLoading(false);
        if (res.success) {
            Swal.fire("Thành công", res.mes, "success");
            setShowForgot(false);
            setForgotEmail("");
        } else Swal.fire("Lỗi", res.mes, "error");
    };


    return (
        <div className="w-full min-h-screen flex justify-center items-center bg-[#F5FFFD] px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-[#016A5E]/20">

                <h1 className="text-3xl font-bold mb-6 text-center text-[#016A5E]">
                    {isRegister ? "Đăng ký tài khoản" : "Đăng nhập"}
                </h1>

                {isRegister && (
                    <div className="grid grid-cols-2 gap-3">
                        <InputField
                            label="Họ"
                            nameKey="firstname"
                            value={payload.firstname}
                            setValue={setPayload}
                        />
                        <InputField
                            label="Tên"
                            nameKey="lastname"
                            value={payload.lastname}
                            setValue={setPayload}
                        />
                    </div>
                )}

                <InputField
                    label="Email"
                    nameKey="email"
                    value={payload.email}
                    setValue={setPayload}
                />

                {isRegister && (
                    <InputField
                        label="Số điện thoại"
                        nameKey="mobile"
                        value={payload.mobile}
                        setValue={setPayload}
                    />
                )}

                <InputField
                    label="Mật khẩu"
                    nameKey="password"
                    type="password"
                    value={payload.password}
                    setValue={setPayload}
                />
                {!isRegister && (
                    <div className="text-right mb-3">
                        <button
                            onClick={() => setShowForgot(true)}
                            className="text-sm text-[#016A5E] hover:underline cursor-pointer"
                        >
                            Quên mật khẩu?
                        </button>
                    </div>
                )}


                <Button
                    onClick={handleSubmit}
                    className="w-full"
                >
                    {isRegister ? "Tạo tài khoản" : "Đăng nhập"}
                </Button>

                <div className="text-sm text-center mt-4">
                    {isRegister ? (
                        <button
                            onClick={() => setIsRegister(false)}
                            className="text-[#016A5E] font-medium hover:underline cursor-pointer"
                        >
                            Quay lại đăng nhập
                        </button>
                    ) : (
                        <button
                            onClick={() => setIsRegister(true)}
                            className="text-[#016A5E] font-medium hover:underline cursor-pointer"
                        >
                            Tạo tài khoản mới
                        </button>
                    )}
                </div>



                {showOTP && (
                    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
                        <div className="bg-white p-6 rounded-lg shadow-xl w-96 relative">

                            {/* Nút tắt */}
                            <button
                                onClick={() => {
                                    setShowOTP(false);
                                    setOtp("");
                                }}
                                className="absolute top-0 right-2 flex items-center justify-center text-4xl 
                                text-gray-500 hover:text-[#016A5E] cursor-pointer transition "
                            >
                                ×
                            </button>

                            <h2 className="text-xl font-bold mb-4 text-center text-[#016A5E]">
                                Nhập mã OTP
                            </h2>

                            <OTPInput value={otp} onChange={setOtp} />

                            <Button
                                onClick={handleVerifyOTP}
                                className="w-full mt-4"
                            >
                                Xác thực
                            </Button>

                            <button
                                onClick={handleResend}
                                disabled={resendCount >= 3 || cooldown > 0}
                                className="mt-4 w-full text-sm text-[#016A5E] hover:underline disabled:text-gray-400 cusror-pointer"
                            >
                                {resendCount >= 3
                                    ? "Bạn đã hết lượt gửi lại"
                                    : cooldown > 0
                                        ? `Gửi lại sau ${cooldown}s`
                                        : "Gửi lại mã OTP"}
                            </button>

                        </div>
                    </div>
                )}



                {showForgot && (
                    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
                        <div className="bg-white p-6 rounded-lg shadow-xl w-120">
                            <h2 className="text-xl font-bold mb-4 text-center text-[#016A5E]">
                                Quên mật khẩu
                            </h2>

                            <input
                                type="email"
                                className="w-full border p-2 rounded mb-4"
                                placeholder="Nhập email của bạn"
                                value={forgotEmail}
                                onChange={(e) => setForgotEmail(e.target.value)}
                            />

                            <Button
                                onClick={handleForgot}
                                className="w-full"
                            >
                                Gửi email
                            </Button>

                            <button
                                onClick={() => setShowForgot(false)}
                                className="mt-4 w-full text-sm text-[#016A5E] hover:underline"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                )}


            </div>
            {isLoading && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-9999">
                    <HashLoader size={60} color="#016A5E" />
                </div>
            )}
        </div>
    );
};

export default Login;
