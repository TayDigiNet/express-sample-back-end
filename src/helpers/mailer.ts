import { MailOption } from "../dto/mailer.dto";

const nodemailer = require("nodemailer");

export default class Mailer {
  private static transporter: any;
  constructor() {}
    static connect() {
        const username = process.env.EMAIL_USERNAME;
        const password = process.env.EMAIL_PASSWORD;

        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
            user: username,
            pass: password,
            },
            logger: true
        });
    
        return this.transporter;
    }
    static getConnect() {
        if (this.transporter) {
            return this.transporter;
        } else {
            return this.connect();
        }
    }

    static async sendMail(mailOptions: MailOption){
        return await this.wrapedSendMail(mailOptions);
    }

    static async wrapedSendMail(mailOptions: MailOption){
        return new Promise((resolve,reject)=>{
            this.transporter.sendMail(mailOptions, function(error: any, info: any){
                if (error) {
                    console.log("error is "+error);
                    resolve({type: "error", message: error}); // or use rejcet(false) but then you will have to handle errors
                } 
                else {
                    console.log('Email sent: ' + info.response);
                    resolve({type: "success", data: info});
                }
            });
        });
    }
}
