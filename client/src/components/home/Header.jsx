import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Header = () => {

    const { isLoggedIn } = useSelector((state) => state.user);

    return (
        <header
            className={`
        w-full h-18 flex items-center justify-between px-12 bg-white fixed top-0 left-0 z-50
        transition-all duration-300 shadow-[0_1px_4px_rgba(0,0,0,0.12)]
    `}
        >

            {/* Left */}
            <div className="flex items-center gap-2">
                <img src={logo} className="w-12 h-12 object-contain" />
                <span className="text-2xl font-semibold tracking-tight text-[#016A5E]">
                    GrammarlyAI
                </span>
            </div>

            {/* Right */}
            {!isLoggedIn && (
                <div className="flex items-center gap-10 text-sm">
                    <Link
                        to="/login"
                        state={{ mode: "login" }}
                        className="underline-offset-4 decoration-2 hover:underline text-base text-[#016A5E] font-bold cursor-pointer"
                    >
                        Đăng nhập
                    </Link>

                    <Link
                        to="/login"
                        state={{ mode: "register" }}
                        className="px-4 py-1 rounded-full border-2 border-[#016A5E] font-bold text-base text-[#016A5E] hover:bg-[#016A5E] hover:text-white transition cursor-pointer"
                    >
                        Đăng ký
                    </Link>
                </div>
            )}
        </header>
    );
};

export default Header;
