import nodemailer from 'nodemailer';

const transporter =()=>{

    const obj = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth:{
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD
        }
    });

    return obj;
}


export default transporter;