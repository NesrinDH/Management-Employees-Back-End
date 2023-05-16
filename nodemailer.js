
import nodemailer from 'nodemailer'

const mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "ghanemdev22@gmail.com",
        pass: "aysyjoytyclkknsd"
    }
})
 export const sendConfirmationEmail = (email, plainPassword) => {
    mailTransporter.sendMail({
        from: "ghanemdev22@gmail.com",
        to: email,
        subject: "Confirmer votre compte",
        html: `<div>
        <h1>Email de confirmation</h1>
        <h2>Bonjour</h2>
        <p>Pour activer votre compte, veuillez cliquer sur ce lien/p>
        <p> email: ${email}<p>
      <p> password: ${plainPassword}<p>
        
        </div>`
    })
    .catch((err) => console.log(err))
}
export const sendEmail = (email, plainPassword) => {
    mailTransporter.sendMail({
        from: "ghanemdev22@gmail.com",
        to: email,
        subject: "Confirmer votre compte",
        html: `<div>
        <h1>Email de confirmation</h1>
        <h2>Bonjour</h2>
        <p>Pour activer votre compte, veuillez cliquer sur ce lien/p>
        <a href=http://localhost:3500/confirm/${plainPassword}>Cliquer ici ! </a>
        </div>`
    })
    .catch((err) => console.log(err))
}

export const sendForgetPassword = (email,userId, token)=>{
    mailTransporter.sendMail({
        from: "ghanemdev22@gmail.com",
        to: email,
        subject: "Password Reset",
        html: `<div>
        <h1>Reset Password</h1>
        <h2>Bonjour</h2>
        <p>To reset your password, please click on the link</p>
        <a href=http://localhost:3500/auth/resetPassword/${userId}/${token}>Click Here ! </a>
        </div>`
    })
    .catch((err) => console.log(err))
}
 export const resetPasswordEmail = (email, password) => {
    mailTransporter.sendMail({
        from: "ghanemdev22@gmail.com",
        to: email,
        subject: "Welcome back to our company ",
        html: `<div>
        <h1>Welcome back to our company </h1>
        <h2>Hello<h2>
        <p>Your password is updated :<p>
        <p> email: ${email}<p>
        <p> password: ${password}<p>
        `
    }) 
    .catch((err) => console.log(err));
}



