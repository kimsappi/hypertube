const nodemailer = require('nodemailer');
const { mailConfig } = require('../config.secret.json');
const getServerUrl = require('../utils/requestUrl');

const transporter = nodemailer.createTransport(mailConfig);

const sendEmail = async (to, subject, content, html) => {
  const email = {
    from: mailConfig.auth.user,
    to: to,
    subject: subject,
    ... html ? {html: content} : {text: content}
  };

  return await transporter.sendMail(email);
}

const HTMLEmail = {
  toString: content => {
    const baseEmailStart = '<html><body>';
    const baseEmailEnd = '</body></html>';
    return baseEmailStart + content + baseEmailEnd;
  }
};

const registration = async (data, req) => {
  const subject = 'Registration to Hiveflix'
  const baseUrl = getServerUrl(req);
  const fullUrl = `${baseUrl}/api/auth/confirmEmail/${data._id}?code=${data.emailVerification}`;
  const content = `
<h2>Thanks for registering to Hiveflix!</h2>
<p>To confirm your email, click <a href='${fullUrl}'>here</a>.
<p>Sincerely,<br>The Hiveflix team</p>
`;
  return await sendEmail(data.email, subject, HTMLEmail.toString(content), true);
};

// Link should probably be to /api/auth/forgotPassword/{id}?code={emailVerification}
const forgotPassword = async data => {
  return true;
};

module.exports = {
  registration,
  forgotPassword
}
