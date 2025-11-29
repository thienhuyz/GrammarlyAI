import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Header = () => {
    const { isLoggedIn } = useSelector((state) => state.user);

    return (
        <header
            className="w-full h-18 flex items-center justify-between px-10 bg-[#F5FBFA] fixed top-0 left-0 z-50
                transition-all duration-300 shadow-[0_2px_6px_rgba(1,106,94,0.15)] border-b border-[#D4ECE7]">
            {/* Left: Logo + Brand */}
            <div className="flex items-center gap-3">
                <img src={logo} className="w-11 h-11 object-contain" alt="GrammarlyAI logo" />
                <span className="text-2xl font-semibold tracking-tight text-[#016A5E]">
                    GrammarlyAI
                </span>
            </div>

            {/* Right: Auth buttons */}
            {!isLoggedIn && (
                <div className="flex items-center gap-8 text-sm">
                    <Link
                        to="/login"
                        state={{ mode: "login" }}
                        className="underline-offset-4 decoration-2 hover:underline text-base text-[#016A5E] font-semibold cursor-pointer"
                    >
                        Đăng nhập
                    </Link>

                    <Link
                        to="/login"
                        state={{ mode: "register" }}
                        className="px-5 py-1.5 rounded-full border-2 border-[#016A5E] font-semibold text-base text-[#016A5E] 
                            hover:bg-[#016A5E] hover:text-white transition cursor-pointer">
                        Đăng ký
                    </Link>
                </div>
            )}
        </header>
    );
};

export default Header;
