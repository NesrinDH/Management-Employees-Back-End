 
 import User from '../Models/userSchema.js'
 import jwt from 'jsonwebtoken'
 
 export const isAuth = async(req, res, next)=> {
  let token 
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
   try{
     //get token from header
     token = req.headers.authorization.split(' ') [1]
     //verify token 
     const decoded = jwt.verify(token, 'RANDOM_TOKEN_SECRET')
     //get user from the token 
      req.user = await User.findById(decoded.id).select('password')
      next()
 
   } catch (error) {
     console.log(error)
     res.status(401)
     throw new Error('Not authorized')
   }
  }
  if(!token){
     res.status(401)
     throw new Error('Not authorized, no token')
  }
 }
 
  