import mongoose from "mongoose";
mongoose.set('strictQuery', false);
export const ConnectToDb=()=>{
    mongoose.connect('mongodb://localhost:27017/employees')
    .then(() =>
     console.log('Connected!'));
}

