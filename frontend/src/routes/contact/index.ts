import nodemailer from 'nodemailer'

import type { Email } from '../../types'

// create transporter object with smtp server details
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
});

export async function post(req, res, next) {
    const email: Email = req.body
    const { from = process.env.EMAIL_ADDRESS, subject, html } = email
    transporter.sendMail({
        to: process.env.EMAIL_ADDRESS,
        from,
        subject,
        html
    }, (err: Error) => {
        if(err) next(err);
        res.end(JSON.stringify({ from, subject, html }))
    })
}
