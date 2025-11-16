const resetPasswordTemplate = (resetToken) => `
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
        Yêu cầu đặt lại mật khẩu
      </h2>

      <p style="
        margin:0 0 16px;
        font-size:14px;
        color:#4b5563;
        line-height:1.6;
      ">
        Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.
        Nhấn vào nút bên dưới để tiếp tục.  
        Liên kết sẽ hết hạn sau <strong>15 phút</strong>.
      </p>

      <div style="text-align:center; margin:28px 0;">
        <a
           href=${process.env.URL_CLIENT}/reset-password/${resetToken}
          style="
            display:inline-block;
            background-color:#016A5E;
            color:#ffffff;
            padding:12px 28px;
            text-decoration:none;
            font-size:15px;
            font-weight:600;
            border-radius:6px;
          "
        >
          Đặt lại mật khẩu
        </a>
      </div>

      <p style="
        margin:0 0 12px;
        font-size:13px;
        color:#6b7280;
        line-height:1.6;
      ">
        Nếu bạn không yêu cầu thao tác này, vui lòng bỏ qua email.  
        Tài khoản của bạn vẫn an toàn.
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

module.exports = resetPasswordTemplate;
