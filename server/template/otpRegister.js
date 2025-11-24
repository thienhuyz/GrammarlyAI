const otpRegister = (otp) => `
  <div style="background-color:#f4f4f5; padding:24px; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
    <div style="
      max-width:480px;
      margin:0 auto;
      background-color:#ffffff;
      border-radius:8px;
      padding:32px 28px;
      box-shadow:0 4px 12px rgba(0,0,0,0.08);
    ">
      
      <h2 style="
        margin:0 0 16px;
        font-size:20px;
        color:#111827;
        font-weight:600;
      ">
        Xác minh đăng ký tài khoản
      </h2>

      <p style="
        margin:0 0 16px;
        font-size:14px;
        color:#4b5563;
        line-height:1.6;
      ">
        Cảm ơn bạn đã đăng ký tài khoản.  
        Đây là mã OTP để xác minh email của bạn.  
        Mã chỉ có hiệu lực trong <strong>5 phút</strong>, vui lòng không chia sẻ cho bất kỳ ai.
      </p>

      <div style="
        margin:24px 0;
        text-align:center;
      ">
        <div style="
          display:inline-block;
          padding:14px 32px;
          border-radius:8px;
          background-color:#016A5E;
          color:#ffffff;
          font-size:26px;
          letter-spacing:6px;
          font-weight:700;
        ">
          ${otp}
        </div>
      </div>

      <p style="
        margin:0 0 12px;
        font-size:13px;
        color:#6b7280;
        line-height:1.6;
      ">
        Nếu bạn không thực hiện yêu cầu đăng ký này, bạn có thể bỏ qua email.  
        Tài khoản của bạn sẽ không được kích hoạt nếu không xác minh OTP.
      </p>

      <hr style="border:none; border-top:1px solid #e5e7eb; margin:24px 0;">

      <p style="
        margin:0;
        font-size:12px;
        color:#9ca3af;
        text-align:center;
      ">
        Đây là email tự động, vui lòng không phản hồi.
      </p>

    </div>
  </div>
`;

module.exports = otpRegister;
