const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

module.exports = {

   send: function(fromEmail, toEmail, subject, content) {
       return new Promise((resolve, reject) => {

        const msg = {
            to: toEmail,
            from: fromEmail,
            subject: subject,
            text: `${content}`,
            html: `<strong>${content}</strong>`,
          }

          sgMail
            .send(msg)
            .then(() => {
                console.log('Email sent')
                resolve()
            })
            .catch((error) => {
                console.error(error)
                reject()
            })

       });
   }
}