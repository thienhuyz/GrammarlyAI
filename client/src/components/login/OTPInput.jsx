import { useRef } from "react";

const OTPInput = ({ value, onChange }) => {
    const inputs = useRef([]);

    const handleChange = (val, index) => {
        if (!/^\d*$/.test(val)) return;

        let otpArr = value.split("");
        otpArr[index] = val.slice(-1);
        onChange(otpArr.join(""));

        if (val !== "" && index < 5) {
            inputs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !value[index] && index > 0) {
            inputs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);

        if (!pasted) return;

        let newOtp = Array(6).fill("");
        pasted.split("").forEach((char, i) => {
            newOtp[i] = char;
        });

        onChange(newOtp.join(""));

        const lastIndex = pasted.length - 1;
        inputs.current[lastIndex].focus();

        e.preventDefault();
    };

    return (
        <div className="flex items-center justify-center gap-3 my-6" onPaste={handlePaste}>
            {Array(6).fill(0).map((_, i) => (
                <input
                    key={i}
                    ref={el => inputs.current[i] = el}
                    maxLength={1}
                    value={value[i] || ""}
                    onChange={(e) => handleChange(e.target.value, i)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    className="
                        w-12 h-12 
                        text-center text-2xl font-semibold
                        border-2 border-gray-300 
                        rounded-xl 
                        focus:outline-none 
                        focus:border-[#016A5E] 
                        focus:ring-2 focus:ring-[#016A5E]/40
                        transition
                    "
                />
            ))}
        </div>
    );
};

export default OTPInput;
