import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import logo from "../../assets/logo.png";
import home from "../../assets/home.png";

const Intro = () => {
    useEffect(() => {
        AOS.init({ duration: 800, once: true });
    }, []);

    return (
        <div className="bg-linear-to-br from-white via-[#F0FAF7] to-[#E4F7F3]">
            {/* SECTION 1 */}
            <section className="w-full pt-24 pb-16 flex justify-center">
                <div className="max-w-[1200px] w-full flex flex-col md:flex-row items-center gap-12 md:gap-20 px-6 md:px-10">
                    {/* LEFT */}
                    <div
                        className="flex flex-col gap-6 max-w-[620px]"
                        data-aos="fade-right"
                    >
                        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-[#016A5E]">
                            Nền tảng AI được thiết kế vì bạn.
                        </h1>

                        <p className="text-lg md:text-xl text-gray-700 leading-relaxed text-justify">
                            Bảo mật luôn là ưu tiên của chúng tôi. Chúng tôi không bán hay kiếm tiền
                            từ nội dung của người dùng, không dùng nội dung đó cho mục đích quảng cáo,
                            và cũng không cho phép các nhà cung cấp dịch vụ bên thứ ba dùng nội dung
                            người dùng để huấn luyện mô hình.
                        </p>

                        <p className="text-base md:text-lg text-gray-500 leading-relaxed text-justify">
                            Làm việc với đối tác AI giúp biến suy nghĩ của bạn thành bài viết rõ ràng,
                            đáng tin cậy và không thể bỏ qua.
                        </p>
                    </div>

                    {/* RIGHT */}
                    <div
                        className="flex-1 flex justify-center"
                        data-aos="fade-left"
                    >
                        <img
                            src={logo}
                            alt="GrammarlyAI logo"
                            className="w-[260px] md:w-[360px] lg:w-[420px] object-contain drop-shadow-xl"
                        />
                    </div>
                </div>
            </section>

            {/* SECTION 2 */}
            <section className="w-full pb-20 flex justify-center" data-aos="fade-up">
                <div className="max-w-[1200px] w-full flex flex-col md:flex-row items-start gap-12 md:gap-20 px-6 md:px-10">
                    {/* LEFT */}
                    <div className="flex flex-col gap-6 max-w-[560px]">
                        <h2 className="text-3xl md:text-5xl font-extrabold leading-tight text-[#016A5E]">
                            Sửa chính xác giúp bạn đạt kết quả tốt.
                        </h2>

                        <p className="text-base md:text-lg text-gray-700 leading-relaxed text-justify">
                            Đưa ra các gợi ý giúp bạn tạo ra nội dung phù hợp mà không làm mất đi
                            nội dung chân thực của mình dù là viết cho chính bạn hay cho thương hiệu
                            của bạn.
                        </p>

                        <p className="text-base md:text-lg text-gray-500 leading-relaxed text-justify">
                            Làm việc thông minh hơn với chuyên gia viết AI hàng đầu.
                        </p>
                    </div>

                    {/* RIGHT */}
                    <div className="flex-1 flex justify-center">
                        <img
                            src={home}
                            alt="Giao diện GrammarlyAI"
                            className="w-[260px] md:w-[380px] lg:w-[460px] object-contain drop-shadow-xl"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Intro;
