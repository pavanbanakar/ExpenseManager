const mongoose = require('mongoose');

const expenseSchema =  mongoose.Schema({
    title:{
        require:true,
        trim:true,
        type:String
    },
    date:{
        require:true,
        type:Date,
        default:Date.now
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        require:true,
        ref:'User'
    },
    amount:{
        type:mongoose.Schema.Types.Decimal128,
        require:true
    },
    description:{
        require:false,
        trim:true,
        type:String
    }
},
{
    timestamps:true
}
);

expenseSchema.index({'$**':'text'})
const Expense  = mongoose.model('Expense',expenseSchema);
module.exports = Expense;