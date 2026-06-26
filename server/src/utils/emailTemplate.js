const { CLIENT_URL } = require("./env");

const verifyTemplate = (name, token) => {
  const text = `
  Hello ${name}, 
  Thank you for creating an account with us. 
  To complete your registration and secure your account, please verify your email address by clicking the link below. 
  This verification helps us confirm that you own this email address and enables full access to all features of your account. If you did not create an account, you can safely ignore this email.
  ${CLIENT_URL}/auth/verify/${token}

  This verification link is intended only for the recipient of this email and may expire after a 30 minutes for security reasons. Do not share this link with anyone.
  `;

  const html = htmlEmailCreator(
    "Thank you for creating an account with us. To complete your registration and secure your account, please verify your email address by clicking the button below. This verification helps us confirm that you own this email address and enables full access to all features of your account. If you did not create an account, you can safely ignore this email.",
    name,
    token,
    "Verify Your Email",
    "auth/verify",
    "This verification link is intended only for the recipient of this email and may expire after a 30 minutes for security reasons. Do not share this link with anyone.",
  );

  const subject = "Email Verification Mail";

  return {
    text,
    html,
    subject,
  };
};

const forgotTemplate = (name, token) => {
  const text = `
  Hello ${name}, 
  We received a request to reset the password for your account. Click the link below to create a new password and regain access to your account. If you did not request a password reset, you can safely ignore this email and no changes will be made to your account.
  ${CLIENT_URL}/auth/forgot/${token}

  For your security, this password reset link will expire in 5 minutes. Do not share this link with anyone. Our team will never ask for your password or this reset link.
  `;

  const html = htmlEmailCreator(
    "We received a request to reset the password for your account. Click the button below to create a new password and regain access to your account. If you did not request a password reset, you can safely ignore this email and no changes will be made to your account.",
    name,
    token,
    "Forgot Password Email",
    "auth/forgot",
    "For your security, this password reset link will expirein 5 minutes. Do not share this link with anyone. Our team will never ask for your password or this reset link.",
  );

  const subject = "Password Reset Mail";

  return {
    text,
    html,
    subject,
  };
};

const htmlEmailCreator = (text, name, token, title, path, caution) => {
  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
  </head>
  <body
    style="
      margin: 0;
      padding: 25px 30px;
      font-family: Verdana, Geneva, sans-serif;
    "
  >
    <table
      role="presentation"
      cellpadding="0"
      cellspacing="0"
      border="0"
      width="100%"
    >
      <tr>
        <td align="center">
          <table
            role="presentation"
            cellpadding="0"
            cellspacing="0"
            border="0"
            width="600"
            style="
              background: #ffffff;
              border-radius: 8px;
              overflow: hidden;
              width: 100%;
              max-width: 600px;
            "
          >
            <tr>
              <td
                style="
                  background: linear-gradient(135deg, red, blue);
                  color: #ffffff;
                  padding: 30px;
                  text-align: center;
                "
              >
                <h1 style="margin: 0">Abdu Mobiles</h1>
                <p style="margin: 5px 0 0; line-height: 1.2; font-size: 15px">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Ratione sit minus minima nemo vero officiis.
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding: 30px; color: #333333">
                <h2 style="margin-top: 0">Hello ${name},</h2>

                <p style="line-height: 1.3">
                  ${text}
                </p>

                <table
                  role="presentation"
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                  width="100%"
                  style="
                    margin: 25px 0;
                    background: #e3e3e3;
                    border-radius: 16px;
                  "
                >
                  <tr>
                    <td align="center" style="padding: 20px">
                      <a href="${CLIENT_URL}/${path}/${token}">
                        <button
                          style="
                            font-size: 16px;
                            font-weight: bold;
                            color: #040025;
                            padding: 10px 16px;
                            border-radius: 10px;
                            border: none;
                            background: linear-gradient(
                              135deg,
                              rgb(255, 128, 0),
                              yellow
                            );
                          "
                        >
                          Verify Email
                        </button>
                      </a>

                      <p
                        style="
                          margin: 15px 0 5px;
                          font-size: 15px;
                        "
                      >
                        If the button is not working paste the following link on your browser
                      </p>

                      <p
                        style="
                          margin: 0;
                          color: #666666;
                          font-size: 13px;
                        "
                      >
                        <a style="color: rgb(0, 115, 255);" href="${CLIENT_URL}/${path}/${token}">
                          ${CLIENT_URL}/${path}/${token}
                        </a>
                      </p>
                    </td>
                  </tr>
                </table>

                <table
                  role="presentation"
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                  width="100%"
                  style="
                    background: #fff3cd;
                    border-left: 4px solid #ffc107;
                    border-radius: 0 10px 10px 0;
                    padding: 0;
                    overflow: hidden;
                  "
                >
                  <tr>
                    <td>
                      <p
                        style="
                          background: #666666;
                          padding: 15px 10px 5px 5px;
                          margin: 0;
                          color: #f4f4f4;
                          font-weight: 700;
                        "
                      >
                        Caution
                      </p>
                      <p style="padding: 15px; margin: 0; font-size: 14px">
                        ${caution}
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td
                style="
                  background: #f4f4f4;
                  padding: 20px;
                  text-align: center;
                  color: #666666;
                  font-size: 14px;
                "
              >
                © Abdu Mobiles. All rights reserved. 2026
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
};

module.exports = {
  verifyTemplate,
  forgotTemplate,
};
