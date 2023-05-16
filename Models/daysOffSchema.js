import mongoose from 'mongoose';
const Schema = mongoose.Schema;

let daysOffSchema = new Schema(
    {
        userId: {
                type: mongoose.Schema.Types.ObjectId, 
                ref:'User', required: true
            },
        startDay : {
                    type: Date,
                    required: true
                },
        endDay : {
                type: Date,
                required: true
            },
        type: {
                type: String,
                enum:["Paid", "Unpaid","Sick"],
                required: true 
            },
            decisionDir: {
                userIdDir: { type: mongoose.Schema.Types.ObjectId, ref:'User'},
                status: {type: Boolean, default: null},
                justification: {type: String , default: null}
                },
            decisionMan:{
                userIdMan: {type: mongoose.Schema.Types.ObjectId,ref:'User'}, 
                status: {type: Boolean, default: false},
                justification: {type: String , default: null}
                },
        decision:{
            type: Boolean,
            default: false
        },      
        statusReq: {
            type: Boolean,
            default:false
        },
        reqDayOff : { 
            type: Number, 
            default: 0
        },
        justificationSick : {
            type: String 
        }

    }, {timestamps: true, versionKey: false}
);

const DayOff = mongoose.model("daysOff", daysOffSchema);
export default DayOff;