import express from "express"
import { addDayOff, daysOffDecision, deleteDayOff, listDayOffById, listDaysOff, updateDayOff } from "../Controlleurs/CrudDayOff.js";
import { checkRole } from "../middlwares/checkRole.js";
import { isAuth } from "../middlwares/isAuth.js";
import { validateObjectId } from "../middlwares/validateObjectId.js"
import { validateRequestDayoff } from "../middlwares/validateData.js"
const router = express.Router()
 

 router.post('/daysOff',isAuth,(req, res, next)=> checkRole(['Super_Admin', 'Director', 'Administration Director', 'Administration Assistant', 'Human Ressources', 'Team Manager', 'Software Engineer'], req, res, next),
 validateRequestDayoff , addDayOff); 
 router.get('/daysOff',isAuth,(req, res, next)=> checkRole(['Super_Admin', 'Director', 'Administration Director', 'Administration Assistant', 'Human Ressources', 'Team Manager', 'Software Engineer'], req, res, next),
 listDaysOff); 
 router.get('/daysOff/:id',isAuth,(req, res, next)=> checkRole(['Super_Admin', 'Director', 'Administration Director', 'Administration Assistant', 'Human Ressources', 'Team Manager', 'Software Engineer'], req, res, next),
 validateObjectId, listDayOffById); 
 router.put('/daysOff/:id',isAuth,(req, res, next)=> checkRole(['Super_Admin', 'Director', 'Administration Director', 'Administration Assistant', 'Human Ressources', 'Team Manager', 'Software Engineer'], req, res, next),
 validateObjectId, updateDayOff)
 router.delete('daysOff/:id',isAuth,(req, res, next)=> checkRole(['Super_Admin', 'Director', 'Administration Director', 'Administration Assistant', 'Human Ressources', 'Team Manager', 'Software Engineer'], req, res, next),
 validateObjectId, deleteDayOff);
// decision taked by only the director and team manager
 router.patch('/daysOff/decision/:id',isAuth,(req, res, next)=> checkRole(['Director','Team Manager'], req, res, next),
 validateObjectId, daysOffDecision);


 export default router;