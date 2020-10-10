import nodemailer from 'nodemailer'
import env from 'node-env-file'

env(__dirname + '../../../../.env');

// create transporter object with smtp server details
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
});

export async function post(req, res, next) {
    const { from = process.env.EMAIL_ADDRESS, subject, html } = req.body;
    transporter.sendMail({
        to: process.env.EMAIL_ADDRESS,
        from,
        subject,
        html
    }, (err, info) => {
        if(err) next(new Error(err));
        res.end(JSON.stringify({ from, subject, html }))
    })
}
