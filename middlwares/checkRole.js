

import jwt from "jsonwebtoken"

export const checkRole= (roles, req, res, next)=> {
    
    const token = req.headers.authorization.split(' ')[1]; 
    const decoded = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); 
    (roles.includes(decoded.role)) ? next() : res.status(403).json({error: 'you dont have permission to do this action'})

}

