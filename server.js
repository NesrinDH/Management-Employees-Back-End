// IMPORT EXPRESS
import express, {json} from 'express';
import userRoute from './Routes/userRoutes.js'
import DayOffRoute from './Routes/DayOffRoutes.js'
import authRoute from './Routes/authRoutes.js'
import { ConnectToDb } from './Configuration/connectDB.js';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json' assert { type: "json" } 

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(json());
import cors from 'cors'
app.use(cors({
  origin: "http://localhost:3000"
}))

// IMPORT ENVIRENEMENT VARIABLE
import * as dotenv from 'dotenv' 
dotenv.config()
//connect to db with mongoose

ConnectToDb()

    const port= process.env.PORT || 4000
    app.listen(port, () => {
      console.log(`server is running on: http://localhost: ${port}`);
    });

// DEFINE THE ROUTER //
app.use('/api-swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(userRoute);
app.use(DayOffRoute);
app.use(authRoute);
