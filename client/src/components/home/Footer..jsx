import logo from "../../assets/logo.png";

const Footer = () => {
    return (
        <footer className="w-full py-4 bg-[#F5FBFA] border-t border-[#D4ECE7] text-[#016A5E]">
            <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between">

                {/* LEFT */}
                <div className="flex items-center gap-2 mb-4 md:mb-0">
                    <img src={logo} alt="logo" className="w-8 h-8" />
                    <span className="text-lg font-semibold">
                        GrammarlyAI
                    </span>
                </div>

                {/* RIGHT */}
                <div className="text-sm opacity-80">
                    © {new Date().getFullYear()} GrammarlyAI. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
