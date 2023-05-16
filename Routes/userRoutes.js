
import express from "express"

import { addUser, deleteUser, disabledUser, getUserById, listUsers, UpdateProfileUser } from "../Controlleurs/CrudUser.js";
import { checkRole } from "../middlwares/checkRole.js";
import { isAuth } from "../middlwares/isAuth.js";
import { validateRequest } from "../middlwares/validateData.js";
import { validateObjectId } from "../middlwares/validateObjectId.js"
const router = express.Router()

router.post("/users",isAuth,(req, res, next)=> checkRole(['Super_Admin'], req, res, next),validateRequest, addUser)
router.get("/users",isAuth,(req, res, next)=> checkRole(['Super_Admin', 'Director', 'Administration Director', 'Administration Assistant', 'Human Ressources', 'Team Manager', 'Software Engineer'], req, res, next), listUsers)
router.get('/users/:id',validateObjectId,isAuth,(req, res, next)=> checkRole(['Super_Admin'], req, res, next), getUserById)
router.patch("/users/toggle-enable/:id",validateObjectId,isAuth,(req, res, next)=> checkRole(['Super_Admin'], req, res, next), disabledUser)
router.delete("/users/:id",validateObjectId,isAuth,(req, res, next)=> checkRole(['Super_Admin'], req, res, next), deleteUser)
router.put("/users/:id",validateObjectId, UpdateProfileUser)


export default router;



