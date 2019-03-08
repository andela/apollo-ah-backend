import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import { env } from './utils';


/**
 * This is the api Mail class
 */
export default class Mail {
  /**
 * This function helps to send mails throughout this application
 * @param {Object} data - This is an object containing the user email, the subject,
 *  the body (html)
 * @returns {Promise} - It returns a promise
 */
  static async sendMail(data) {
    let transporter;
    if (env('NODE_ENV') === 'development') {
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
          user: 'armando.haag@ethereal.email',
          pass: 'vzqEWNH9SjSxAntXMs'
        }
      });
    } else {
      transporter = nodemailer.createTransport({
        host: env('MAIL_HOST'),
        secure: env('MAIL_SECURE'),
        auth: {
          user: env('MAIL_USER'),
          pass: env('MAIL_PASS')
        }
      });
    }
    transporter.use('compile', hbs({
      viewEngine: {
        extName: '.hbs',
        partialsDir: 'views/partials',
        layoutsDir: 'views/email',
      },
      viewPath: 'views/email',
      extName: '.hbs'
    }));
    // set the mail options
    const mailOptions = {
      from: env('APP_MAIL'),
      to: data.email,
      subject: data.subject,
      template: data.template,
      context: data.mailContext
    };
    const info = await transporter.sendMail(mailOptions);
    return info;
  }
}
