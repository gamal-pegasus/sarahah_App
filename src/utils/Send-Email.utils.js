import nodemailer from 'nodemailer'
import { EventEmitter } from 'node:events';




export const sendEmail=async({
    to,  
    content,
    cc='lqrcsroalberhjgmfm@nespj.com',
    subject,
    attachments=[],
})=>{
    const transporter =nodemailer.createTransport({
        host:'smtp.gmail.com',
        port:465,
        auth:{
            user:process.env.USER_EMAIL,
            pass:process.env.USER_PASSWORD
        },
        tls:{
            rejectUnauthorized:false,
        }
    });
    

    const info=await transporter.sendMail({
        from:'gamal200224@gmail.com',
        to,
        cc,
        html:content,
        subject,
        attachments,
    })
    return info
};

 export const emitter=new EventEmitter()

emitter.on('sendEmail',(agrs)=>{
    console.log('the sending email event is started');
    sendEmail(agrs)
})