const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");
require("dotenv").config();

const sendMail = (data) =>
  new Promise((resolve, reject) => {
    // data = {
    //   to: "bagustri15@gmail.com",
    //   subject: "...",
    //   template: "...",
    //   attchment: [{...}],
    //   data: {...}
    // }
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "memo.in.aja@gmail.com",
        pass: "Rahasia123!",
      },
    });

    transporter.use(
      "compile",
      hbs({
        viewEngine: {
          extname: ".html",
          partialsDir: path.resolve("./src/templates/email"),
          defaultLayout: false,
        },
        viewPath: path.resolve("./src/templates/email"),
        extName: ".html",
      })
    );

    const mailOptions = {
      from: '"Ticketing App 👻" <memo.in.aja@gmail.com>', // DARI SIAPA
      to: data.to, // DIKIRIM KEMANA
      subject: data.subject, // HEADER DARI EMAIL
      // html: "<b>Click Here to Activate</b>",
      template: data.template, // ISI DARI EMAIL
      context: data.data, // DATA YANG NNTI BSA DIMASUKAN KE DALAM TEMPLATE
    };

    if (data.attachment) {
      if (data.attachment.length > 0) {
        mailOptions.attachment = data.attachment;
      }
    }

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        console.log(`Email sent !${info.response}`);
        resolve(info.response);
      }
    });
    // console.log("PROSES SEND MAIL WORKS !");
  });

module.exports = sendMail;
