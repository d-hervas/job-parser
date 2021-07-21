const nodemailer = require('nodemailer');

async function sendMail(email_to, subject) {
  // Probably could move the init of the mail to the server startup (?)

  const testAccount = await nodemailer.createTestAccount().catch(() => { throw new Error('Error creating email account'); });

  // create reusable transporter object using the default SMTP transport
  let transporter;
  try {
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      // do not do this in production lol
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
  } catch (err) {
    throw new Error('Error creating email transporter');
  }

  // send mail
  const mail = await transporter.sendMail({
    from: 'job-parser <foo@example.com>',
    to: email_to,
    subject: `New Job found! - ${subject}`,
    text: 'New job blah blah blah',
  }).catch(() => { throw new Error('Error sending email'); });

  return mail;
}

module.exports = sendMail;
