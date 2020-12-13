import type { ServerResponse } from 'http';
import nodemailer from 'nodemailer'
import type { Next } from 'polka';

import type { Email } from '../../types'

// create transporter object with smtp server details
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
});

export async function post(req: Request, res: ServerResponse, next: Next) {
    const { from = process.env.EMAIL_ADDRESS, subject, html } = <Email><unknown>req.body
    transporter.sendMail({
        to: process.env.EMAIL_ADDRESS,
        from,
        subject,
        html
    }, (err: Error) => {
        if (err) next(err);
        res.end(JSON.stringify({ from, subject, html }))
    })
}
