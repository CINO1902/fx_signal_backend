const nodemailer = require('nodemailer');
const path = require('path');

const pdfPath = path.resolve(__dirname, '../file/copyofinsidelife.pdf');


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
                    <p>Thank you for your purchase of the <strong>ForexMaster Pro Indicator</strong>.</p>
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
                        <p>Contact us: support@yourcompany.com</p>
                        <p><a href="https://yourcompany.com">www.yourcompany.com</a></p>
                    </div>
                </div>
            </body>
            </html>
          `,
          attachments: [
            {
              filename: 'ForexMasterPro.pdf',
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
                    <p>Contact us: support@forexmasterpro.com | <a href="https://yourcompany.com">www.yourcompany.com</a></p>
                </div>
            </div>
        </body>
        </html>
      `
    };
  
    // Send the email and return the promise
    return transporter.sendMail(mailOptions);
  };

module.exports = { sendOTPEmail , sendProductEmail, sendMessageReceivedEmail};
