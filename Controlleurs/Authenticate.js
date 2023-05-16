

import User from '../Models/userSchema.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { sendForgetPassword, resetPasswordEmail } from '../nodemailer.js';
import dayjs from 'dayjs';
import user from '../Models/userSchema.js';

//.........signIn....................
export const signIn = (req, res) => {
  User.findOne({ email: req.body.email }) 
  .then(user => { 
      if (!user) { 
          return res.status(404).json({ error: 'User not found !' }); 
      } 
      if(user.isActive === false){
          return res.status(401).json({ error: "You can't login ! You are disabled ! "}); 
      }
     bcrypt.compare(req.body.password, user.password) 
      .then(result => { 
          if (!result) { 
             return res.status(401).json({  error: 'Incorrect password !'});    
          }
          let debutContrat = user.createdAt
          let localDate = dayjs(new Date())
          let diifNowDebut = localDate.diff(debutContrat, 'months')
          let newSoldDays = 2 * diifNowDebut
          user.soldeDays = newSoldDays
          user.save()
          res.status(200).json({ 
              userId: user._id, 
              token: jwt.sign( 
                  { userId: user._id , role: user.role}, 
                  'RANDOM_TOKEN_SECRET',
                  { expiresIn: '24h' }), 
              refreshToken: jwt.sign(
                  { userId: user._id , role: user.role}, 
                  'RANDOM_TOKEN_SECRET',
                  { expiresIn: '48h' }
              )   
          });  
          if(user.allDaysOff === 24) {
              console.log("you have finished your leave balance !")
              
          }     
      }) 
      .catch(error => res.status(400).json({ error }));       
  })
  .catch(error => res.status(500).json({ error }));   
}
//................FORGET PASSWORD..........................
export const forgetPassword = async(req, res) => {
    const {email}= req.body
    try {
        const oldUser = await User.findOne({email})
        if (!oldUser) {
            return res.send("user not exist")
        }
        const secret = 'RANDOM_TOKEN_SECRET' + oldUser.password
        const token = jwt.sign(
            {email: oldUser.email, id: oldUser._id},
            secret,
            { expiresIn: '24h' })
            sendForgetPassword(oldUser.email,oldUser._id, token)
            res.status(200).json({ message: 'please check your email for reset your password!'})
  } catch (error) {
    res.status(500).json({ error })
  }
}
//................Reset PASSWORD...................
export const resetPassword = async(req, res) => {
    
  const {password, token} = req.body;
  try {
  const decodedToken = jwt.decode(token)
  const userId = decodedToken.id
  const oldUser = await User.findOne({_id: userId})
  if(!oldUser) {
      return res.status(404).json({error: 'User not found'})
  }
      const encryptedPassword = await bcrypt.hash(password, 10)
      await User.updateOne(
          {_id: userId},
          {
            $set : {
              password: encryptedPassword
              }
          }
      )
      resetPasswordEmail(oldUser.email, password)
      res.status(200).json({message: "password updated..please log in"} )
  } catch (error) {
      res.status(500).json({message: "somthing went wrong!"})
      }
}
