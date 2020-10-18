import type { Email } from '../types'

interface Body {
    from?: string,
    subject: string,
    html: string
}

interface Args {
    body: Body,
    onSuccess?: (data: Email) => void
    onError?: (e: Error) => void
}

interface SendEmail {
    (args: Args): Promise<void>
}

let sendEmail: SendEmail;

sendEmail = async function({ body, onSuccess, onError }) {
    try {
        const response = await fetch('/contact', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        })

        if (Number(response.status) >= 400) {
            if(onError) onError(new Error("cannont send mail"))
        } else {
            const data = await response.json()
            if(onSuccess) onSuccess(data)
        }

    } catch (e) {
      if(onError) onError(e)
    }
}

export default sendEmail
