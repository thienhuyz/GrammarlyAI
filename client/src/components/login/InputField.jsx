const InputField = ({ label, nameKey, value, type = "text", setValue }) => {
    return (
        <div className="flex flex-col mb-4 w-full">
            <label className="mb-1 font-medium text-gray-700">{label}</label>
            <input
                type={type}
                value={value}
                onChange={(e) =>
                    setValue((prev) => ({ ...prev, [nameKey]: e.target.value }))
                }
                className="border border-gray-300 px-3 py-2 rounded-md outline-none focus:border-[#016A5E] focus:ring-2 focus:ring-[#016A5E]/30"
            />
        </div>
    );
};

export default InputField;
