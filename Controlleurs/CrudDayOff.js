import DayOff from '../Models/daysOffSchema.js'
import User from '../Models/userSchema.js';
import jwt from 'jsonwebtoken';
import dayjs from 'dayjs';

//...........ADD NEW DAYOFF.............
export const addDayOff=async(req,res)=>{ 
    const token = req.headers.authorization.split(' ')[1]; 
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); 
    const userId = decodedToken.userId
    try{
         let day = new DayOff({
             userId: userId,
             startDay:req.body.startDay,
             endDay:req.body.endDay, 
             type:req.body.type,
             justificationSick: req.body.justificationSick
             }); 
             let startDay = dayjs(day.startDay)
             let endDay = dayjs(day.endDay)
             let reqDay = endDay.diff(startDay, 'days')
             if(reqDay > process.env.maxDaysByMonth) {
                 return res.status(201).send({ message : "maximum 10 days"})
             }
             day.reqDayOff = reqDay
             await day.save();
             return res.status(200).send({ message: `your request is succussffully added and the id of it ${day._id} ` });
         }
         catch (err) {
             res.status(400).send({ error: `error adding new Days Off ${err}` })
             }
     }
//..................LIST OF ALL DAYOFF................
export const listDaysOff= async(req,res)=>{
    const token = req.headers.authorization.split(' ')[1]; 
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); 
    const userReqId = decodedToken.userId;
    const verifyUser = DayOff.userId = userReqId
    console.log("verifyUser " , verifyUser);
     try{
        let { page, limit, sortBy,createdAt, createdAtAfter, createdAtBefore } = req.query;
        if(!page) page=1
        if(!limit) limit=30
        const skip = (page - 1) * limit;
        const daysoff = await DayOff.find({ userId : verifyUser })
          .sort({ [sortBy]: createdAt })
          .skip(skip)
          .limit(limit)
          .where('createdAt').lt(createdAtBefore).gt(createdAtAfter)
          const count= await DayOff.count() //estimatedDocumentCount() or countDocuments()
          res.send({page:page,limit:limit,totalDaysOff: count, daysoff:daysoff})
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    } ;
//..................................display ONE DAY OFF...................
export const listDayOffById=async(req,res)=>{ 
    try{
         await DayOff.findById({ _id: req.params.id }) 
         .then(result=>{ res.send(result) }) 
        } catch(err){ res.send(err) } };

//.......tacke the decision of request only by the team manager and director
export const daysOffDecision = async (req, res) => {
    const { id } = req.params
    const idReq = await DayOff.findOne({_id: id})
    if(!idReq) {
        return res.json({error: 'Request not found'})
    }
    try {
        const token = req.headers.authorization.split(' ')[1]; 
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); 
        const userId = decodedToken.userId; 
        if(decodedToken.role === "Team Manager"){
            await DayOff.findByIdAndUpdate(
                {_id: id},
                {$set : {
                    "decisionMan.userIdMan": userId,
                    "decisionMan.status": req.body.Status,
                    "decisionMan.justification": req.body.justificationMan
                    }
            }    
            ) 
        }
        if(decodedToken.role === "Director"){
            await DayOff.findByIdAndUpdate(
                {_id: id},
                {$set : {
                    "decisionDir.userIdDir": userId,
                    "decisionDir.status": req.body.Status,
                    "decisionDir.justification": req.body.justificationDir
                    }
            }
                
            )
            await DayOff.findByIdAndUpdate(
                {_id: id},
                {$set : {
                    "decision": true
                 }
            })
            
        }
        res.status(200).send({ message: `user with id = ${userId} ,your answer is succussffully send` });
    }
    catch (err) {
        res.status(400).send({ error: `error adding new Days Off ${err}` })
        }
}
//the status of request (Accepted or Declined)
export const statusReq = async ( req, res) => {
    const { id } = req.params
    const idReq = await DayOff.findOne({_id: id})
    const idUser = idReq.userId
    let user = await User.findOne({_id: idUser})
    let oldSoldDays = user.soldeDays
    let statusMan = idReq.decisionMan.status
    let statusDir = idReq.decisionDir.status
    let reqDays = idReq.reqDayOff
    let oldSoldSick = user.daysOffSick
    if(statusDir && statusMan === true){
        await DayOff.findByIdAndUpdate(
            {_id: id}, 
            {$set : {
                "statusReq" : true
            }}
        )
        if(idReq.justificationSick != null && user.daysOffSick < process.env.soldDaysOffSick) {
            await DayOff.findByIdAndUpdate(
                {_id: id}, 
                {$set : {
                    "type" : `Sick`
                }}
            )
            await User.findByIdAndUpdate( 
                {_id: idUser},
                {$set : {
                    "daysOffSick" : oldSoldSick + reqDays
                    
                    }
                }
            )
        }
        let allDaysOff = user.allDaysOff + reqDays
        if(allDaysOff > process.env.soldDaysByYear) {
            await DayOff.findByIdAndUpdate(
                {_id: id}, 
                {$set : {
                    "type" : `Unpaid`
                    }
                }
            )
        }
        let newSoldDays = oldSoldDays - reqDays
        await User.findByIdAndUpdate( 
            {_id: idUser},
            {$set : {
                "soldeDays" : newSoldDays
                }
            }
        )
        if(idReq.type != 'Sick')
        await User.findByIdAndUpdate( 
            {_id: idUser},
            {$set : {
                "allDaysOff": allDaysOff
                }
            }
        )
    }  
}

//.............delete request................
export const deleteDayOff=async(req,res)=>{
    const{id} = req.params;
    const dayoff = await DayOff.findOne({_id:id})
    if(!dayoff){
        return res.status(401).json({error:`Request not found or you are disabled now! `})
    }
    if(dayoff.decision === true){
        return res.status(401).json({error:`you can not remove this request!`})
    }
    try{
       const dayoffDel = await DayOff.findOneAndDelete({_id:req.params.id})
    res.status(200).send({message:`${dayoffDel.id} is succussffully deleted`})
    }
    catch(err){
        res.json({message:`srror deleting!`})
    }
};
//............update request..............
export const updateDayOff=async(req, res)=> {
    if(!req.body){
        return res.status(400).send({message:`Day off can not update, be empty!`})
    }
    const {id} = req.params;
    DayOff.findOne({_id: id})
    .then(dayoff => {
        if(!dayoff){ 
            return res.status(401).json({ error: 'Request not found !' }); } 

        if(dayoff.decision === true){
            res.status(401).json({error:`you can't update this request`})}    
        });

    try {
            const dayoff = await DayOff.findByIdAndUpdate(req.params.id,req.body );   
            let startDay = dayjs(DayOff.startDay)
            let endDay = dayjs(DayOff.endDay)
            let reqDay = endDay.diff(startDay, 'days')
            if(reqDay > process.env.maxDaysByMonth) {
                return res.status(201).send({ message : "maximum 10 days"})
            }
            DayOff.reqDayOff = reqDay      
            await dayoff.save()
            res.status(200).send({ message: 'successful updating' });
         }
    catch (error) {
        res.status(500).json({err: 'err'}); 
    }
}


