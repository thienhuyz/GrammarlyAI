
const Button = ({ children, onClick, className }) => {
    return (
        <button
            onClick={onClick}
            className={`py-2 px-4 rounded-md bg-[#016A5E] text-white font-semibold cursor-pointer
                        hover:bg-[#01564C] transition ${className}`}
        >
            {children}
        </button>
    );
};

export default Button;
