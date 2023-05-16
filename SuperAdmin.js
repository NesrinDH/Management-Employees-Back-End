import { ConnectToDb } from './Configuration/connectDB.js'
import User from '../backend/Models/userSchema.js'
import bcrypt from 'bcryptjs'
import data from './SuperAdmin.json' assert { type: "json" }
import { sendConfirmationEmail } from './nodemailer.js'


//connect to db with mongoose
ConnectToDb()

  // Add Supper-admin
 const pass= 'hdgdtehkslhdgdslqmq1234'
 let generatedPassword= ''
 for (let i=0; i<8; i++) {
    generatedPassword += pass.charAt(Math.floor(Math.random() * pass.length))
 }
const plainPassword= generatedPassword;
  const query= User.findOne({ 'role': 'Super_Admin' })
  query.select('role')
  query.exec((err,res) =>{
    if(err) res.status(500).json({ err })
    else{
        if(res) {
            console.log({'message' : 'Super Admin is already exist'})
            return process.exit()
    } else {
         bcrypt.hash(plainPassword, 10)
        .then((hashedPassword) => {
            const userAdmin= new User({...data, password: hashedPassword});
            console.log("plainPassword", plainPassword)
            userAdmin.isActive= true
            userAdmin.save()
            sendConfirmationEmail(userAdmin.email, plainPassword)
            
            console.log({'message':'super admin has created'})
           
        }) .catch((err)=> console.log({'message':'err'}))
    }
  }
})

