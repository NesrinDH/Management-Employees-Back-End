import User from '../Models/userSchema.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { sendEmail } from '../nodemailer.js';

//.......... ADD USER...................
export const addUser= async(req, res) => {
     //methode for generate password
     //........................................
     const pass= 'hdgdtehkslhdgdslqmq1234'
      let generatedPassword= ''
      for (let i=0; i<8; i++) {
       generatedPassword += pass.charAt(Math.floor(Math.random() * pass.length))
     }
     const plainPassword= generatedPassword;
    try {
      // Hash password
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(plainPassword, salt)
      
      // Create user in our database
      const user = await User.create({
        firstName: req.body.firstName,
        lastName:req.body.lastName,
        email:req.body.email,
        role:req.body.role,
        building:req.body.building,
        phone:req.body.phone,
        avatar:req.body.avatar,
        password: hashedPassword})
       if(user) {
        res.status(201).json({ message: "User Created" })
      sendEmail(user.email, plainPassword)
       }
      
    } catch (error) {
      res.status(400).json({ message: error.message || "some error" });
  }
}

  //............DISABLE USER............

export const disabledUser =async(req, res)=>{
    try{
      await User.findOne({ _id:req.params.id })
         .then(user => {
          if (user.isActive) {
            user.isActive = false;
            user.save();
            res.send('User disabled successfully');
          } else {
            user.isActive = true;
            user.save();
            res.send('User enabled successfully');
          }
 
         })
        }
        catch(err) {
          res.status(500).json({ err: 'error' })
        }
  }
   //...........DELETE USER...............
    export const deleteUser =async(req, res)=>{
      try {
        const user = await User.findByIdAndDelete(req.params.id)
        res.status(200).send({ message: `${user} is succussffully deleted` });
    }
    catch (err) {
        res.status(404).send({ error: `error deleting user ${err} . Not found !` })
        }
    }

    //..............UPDATE USER PROFILE...........

    export const UpdateProfileUser =async(req, res) =>{ 
   
      try{ 
       const token = req.headers.authorization.split(' ')[1]; 
       const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); 
       
            if(decodedToken.role !== "Super_Admin"){
            const user= await User.findByIdAndUpdate({_id:req.params.id},{
               firstName : req.body.firstName,
               lastName : req.body.lastName,
               phone : req.body.phone,
               avatar: req.body.avatar
            }) 
           await user.save();
           res.status(200).send(user);
           }
           else {
               const user= await User.findByIdAndUpdate({_id:req.params.id}, req.body)
               await user.save();
               res.status(200).send(user);
           }
       }
       catch (err) {
       res.status(500).send(err)
       }
       
   }
   
  // Define a route to fetch all users
  export const listUsers= async (req, res) => {
    
    
    let { page, limit, sortBy,createdAt, createdAtBefore, createdAtAfter } = req.query
    if(!page) page=1
    if(!limit) limit=30

    const skip=(page-1)*limit
   const users= await User.find()
                          .sort({ [sortBy]: createdAt })
                          .skip(skip)
                          .limit(limit)
                          .where('createdAt').lt(createdAtBefore).gt(createdAtAfter)
                          .select('-password')
   const count= await User.count()
   res.send({page:page,limit:limit,totalUsers: count,users:users})
  }
  
//..................
export const getUserById= async(req,res)=>{
  try{
      await User.find({_id:req.params.id}).select('-password') 
      .then(result=>{ res.send(result) }) 
     } catch(err){ console.log(err) }; 
 } ;



