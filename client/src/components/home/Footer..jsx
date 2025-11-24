import logo from "../../assets/logo.png";

const Footer = () => {
    return (
        <footer className="w-full py-4 bg-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.12)]">
            <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between">

                {/* LEFT*/}
                <div className="flex items-center gap-2 mb-4 md:mb-0">
                    <img src={logo} alt="logo" className="w-8 h-8" />
                    <span className="text-lg font-semibold text-gray-700">GrammarlyAI</span>
                </div>



                {/* RIGHT*/}
                <div className="text-sm text-gray-500 mt-4 md:mt-0">
                    © {new Date().getFullYear()} GrammarlyAI
                </div>
            </div>
        </footer>
    );
};

export default Footer;
