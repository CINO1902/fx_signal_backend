const nodemailer = require('nodemailer');
const path = require('path');

const pdfPath = path.resolve(__dirname, '../file/forexmasterpro.ex4');


/**
 * Sends an OTP email using Nodemailer.
 *
 * @param {string} email - The recipient email address.
 * @param {string} otp - The one-time password.
 * @returns {Promise} - Resolves if the email is sent successfully.
 */
const sendOTPEmail = async (email, otp) => {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "caleboruta.co@gmail.com",
      pass: "jrnbecbxpryesqzq"
    }
  });

  // Define mail options with styled HTML content
  const mailOptions = {
    from: "caleboruta.co@gmail.com",
    to: email,
    subject: "Email OTP",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>OTP Verification</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  padding: 20px;
              }
              .container {
                  max-width: 600px;
                  margin: 0 auto;
                  background: #ffffff;
                  padding: 20px;
                  border-radius: 8px;
                  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                  text-align: center;
              }
              .otp {
                  font-size: 24px;
                  font-weight: bold;
                  color: #333;
                  margin: 20px 0;
              }
              .footer {
                  font-size: 12px;
                  color: #777;
                  margin-top: 20px;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <h2>One-Time Password (OTP) Verification</h2>
              <p>Dear User,</p>
              <p>Your one-time password (OTP) for secure access is:</p>
              <p class="otp">${otp}</p>
              <p>This OTP is valid for <strong>10 minutes</strong> and should not be shared with anyone.</p>
              <p>If you did not request this code, please ignore this email or contact our support team immediately.</p>
              <p class="footer">
                Best regards, <br>
                <strong>FX Signal Trade</strong> <br>
                Contact Us: support@yourcompany.com <br>
                <a href="https://yourcompany.com">www.yourcompany.com</a>
              </p>
          </div>
      </body>
      </html>
    `
  };

  // Send the email and return the promise
  return transporter.sendMail(mailOptions);
};


const sendProductEmail = async (email, billingDetails) => {
    // Create a transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "caleboruta.co@gmail.com",
        pass: "jrnbecbxpryesqzq"
      }
    });
  
    // Define mail options with styled HTML content
    const mailOptions = {
          from: "caleboruta.co@gmail.com",
          to: email,
          subject: "Your Purchase Confirmation - FX Signal Trade",
          html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Purchase Confirmation</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        padding: 20px;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        background: #ffffff;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                        text-align: left;
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 20px;
                    }
                    .billing {
                        margin: 20px 0;
                        border-top: 1px solid #eee;
                        padding-top: 10px;
                    }
                    .footer {
                        font-size: 12px;
                        color: #777;
                        text-align: center;
                        margin-top: 20px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>Purchase Confirmation</h2>
                    </div>
                    <p>Dear ${billingDetails.firstName},</p>
                    <p>Thank you for your purchase of the <strong>RallySignal Indicator</strong>.</p>
                    <p>Please find attached your product along with your purchase invoice.</p>
                    
                    <div class="billing">
                        <h3>Billing Details</h3>
                        <p><strong>Name:</strong> ${billingDetails.firstName} ${billingDetails.lastName}</p>
                        <p><strong>Email:</strong> ${billingDetails.email}</p>
                        <p><strong>Address:</strong> ${billingDetails.address}</p>
                        <p><strong>City:</strong> ${billingDetails.city}</p>
                        <p><strong>State:</strong> ${billingDetails.state}</p>
                        <p><strong>ZIP Code:</strong> ${billingDetails.zipCode}</p>
                        <p><strong>Country:</strong> ${billingDetails.country}</p>
                    </div>
                    
                    <p>If you have any questions or need further assistance, please contact our support team.</p>
                    <p>Best regards,</p>
                    <p><strong>FX Signal Trade Team</strong></p>
                    
                    <div class="footer">
                        <p>Contact us: support@rallysignal.com</p>
                        <p><a href="https://rallysignals.com">www.rallysignals.com</a></p>
                    </div>
                </div>
            </body>
            </html>
          `,
          attachments: [
            {
              filename: 'RallySignal.ex4',
              path: pdfPath // adjust the path to where your PDF is located
            }
          ]
      };
      
  
    // Send the email and return the promise
    return transporter.sendMail(mailOptions);
  };



  const sendMessageReceivedEmail = async (email, firstname) => {
    // Create a transporter using Gmail (or configure another provider)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "caleboruta.co@gmail.com",
        pass: "jrnbecbxpryesqzq"
      }
    });
    
    // Define mail options. You can customize the HTML content as needed.
    const mailOptions = {
      // Use a no-reply email address if available; otherwise, ensure the "from" address is clear.
      from: '"FX Signal Trade" <noreply@forexsignaltrade.com>',
      to: email,
      subject: "We Have Received Your Message - FX Signal Trade",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Message Received</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    padding: 20px;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    background: #ffffff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                    text-align: left;
                }
                .header {
                    text-align: center;
                    margin-bottom: 20px;
                }
                .footer {
                    font-size: 12px;
                    color: #777;
                    text-align: center;
                    margin-top: 20px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2>Thank You For Your Message!</h2>
                </div>
                <p>Dear ${firstname},</p>
                <p>We have received your message and our team will review your inquiry shortly.</p>
                <p>If your matter is urgent, please call us directly.</p>
                <p>Thank you for reaching out to FX Signal Trade.</p>
                <p>Best regards,</p>
                <p><strong>FX Signal Trade Team</strong></p>
                <div class="footer">
                    <p>This is an automated message. Please do not reply directly to this email.</p>
                    <p>Contact us: support@rallysignal.com | <a href="https://rallysignals.com">www.rallysignals.com</a></p>
                </div>
            </div>
        </body>
        </html>
      `
    };
  
    // Send the email and return the promise
    return transporter.sendMail(mailOptions);
  };



  const sendMessageReceivePersonalEmail = async (email, fullname) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "caleboruta.co@gmail.com",
        pass: "jrnbecbxpryesqzq"
      }
    });
  
    const mailOptions = {
      from: '"Caleb Oruta" <noreply@caleboruta.co>',
      to: email,
      subject: "Thanks for Reaching Out – We’ve Received Your Message",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <title>We’ve Received Your Message</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Arial, sans-serif;
              background-color: #f9fafb;
              color: #333;
              margin: 0;
              padding: 0;
            }
            .wrapper {
              width: 100%;
              padding: 20px 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              border-radius: 6px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.05);
              overflow: hidden;
            }
            .header {
              background-color: #004aad;
              color: #fff;
              text-align: center;
              padding: 30px 20px;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
            }
            .content {
              padding: 20px;
              line-height: 1.6;
            }
            .content p {
              margin-bottom: 16px;
            }
            .button {
              display: inline-block;
              margin: 20px 0;
              padding: 12px 24px;
              background-color: #004aad;
              color: #fff;
              text-decoration: none;
              border-radius: 4px;
            }
            .footer {
              font-size: 12px;
              color: #777;
              text-align: center;
              padding: 20px;
            }
            .footer a {
              color: #004aad;
              text-decoration: none;
            }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="container">
              <div class="header">
                <h1>Thank You, ${fullname}!</h1>
              </div>
              <div class="content">
                <p>We’ve successfully received your message via the contact form on my portfolio site. I’m reviewing your inquiry and will get back to you within <strong>1–2 business days</strong>.</p>
                <p>If you have any additional details you’d like to share in the meantime, simply reply to this email and I’ll add it to your request.</p>
                <a href="https://caleboruta.co/contact" class="button" target="_blank">View Your Inquiry</a>
                <p>Thanks again for reaching out. I look forward to speaking with you soon!</p>
                <p>— Caleb Oruta</p>
              </div>
              <div class="footer">
                <p>This is an automated message; please do not reply directly.</p>
                <p>Questions? <a href="mailto:caleboruta.co@gmail.com">caleboruta.co@gmail.com</a> | <a href="https://caleboruta.co">caleboruta.co</a></p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };
  
    return transporter.sendMail(mailOptions);
  };
  

  const sendContactQuery = async (email, fullname, message) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "caleboruta.co@gmail.com",
        pass: "jrnbecbxpryesqzq"
      }
    });
  
    const mailOptions = {
      from: '"Portfolio Contact Form" <noreply@caleboruta.co>',
      to: "caleboruta.co@gmail.com",         // always you
      subject: "New Contact Form Submission",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <title>New Contact Submission</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Arial, sans-serif; background: #f9fafb; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); overflow: hidden; }
            .header { background: #004aad; color: #fff; text-align: center; padding: 20px; }
            .header h1 { margin: 0; font-size: 20px; }
            .section { padding: 20px; line-height: 1.6; }
            .section h2 { margin-top: 0; font-size: 18px; color: #004aad; }
            .detail { margin-bottom: 10px; }
            .user-message { background: #f1f1f1; padding: 15px; border-radius: 4px; white-space: pre-wrap; }
            .footer { font-size: 12px; color: #777; text-align: center; padding: 15px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Contact Form Received</h1>
            </div>
            <div class="section">
              <h2>Sender</h2>
              <div class="detail"><strong>Name:</strong> ${fullname}</div>
              <div class="detail"><strong>Email:</strong> ${email}</div>
            </div>
            <div class="section">
              <h2>Message</h2>
              <div class="user-message">${message}</div>
            </div>
            <div class="footer">
              <p>This email was generated from your portfolio contact form.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };
  
    return transporter.sendMail(mailOptions);
  };
  

module.exports = { sendOTPEmail , sendProductEmail, sendMessageReceivedEmail, sendMessageReceivePersonalEmail, sendContactQuery};
