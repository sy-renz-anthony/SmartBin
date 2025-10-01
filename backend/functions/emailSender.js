import axios from 'axios';

export const sendPasswordResetOTPEmail = async(receiverEmail, receiverName, otp) =>{
    try {
    const response = await axios.post(
      process.env.BREVO_EMAIL_API_ENDPOINT,
      {
        sender: { email: process.env.SENDER_EMAIL_ID , name: 'SmartBin Admin Portal' },
        to: [{ email: receiverEmail, name: receiverName }],
        subject: 'SmartBin v_0.1 User Admin Portal Password Reset verification OTP',
        htmlContent: `Your SmartBin v_0.1 User Admin Portal Password Reset OTP code is ${otp}. Please verify your account using this code to reset your password.`
      },
      {
        headers: {
          'accept': 'application/json',
          'api-key': process.env.BREVO_API_KEY,
          'content-type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error sending email: ', error.response?.data || error.message);
  }

}

export const sendNewPasswordEmail = async(receiverEmail, receiverName, password) =>{
    try {
    const response = await axios.post(
      process.env.BREVO_EMAIL_API_ENDPOINT,
      {
        sender: { email: process.env.SENDER_EMAIL_ID , name: 'SmartBin Admin Portal' },
        to: [{ email: receiverEmail, name: receiverName }],
        subject: "Welcome to SmartBin v_0.1 User Admin Portal",
        htmlContent: `Welcome to SmartBin v_0.1 User Admin Portal. You have successfully registered your account with email: `+emailAdd+"\n\nA random password is generated for you: "+password+"\n\nPlease update this when you login.\n\nThank you."
      },
      {
        headers: {
          'accept': 'application/json',
          'api-key': process.env.BREVO_API_KEY,
          'content-type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error sending email: ', error.response?.data || error.message);
  }

}