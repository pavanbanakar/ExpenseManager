const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
    description: {
        type: String,
        require: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },

    owner:{
        type:mongoose.Schema.Types.ObjectId,
        require:true,
        ref:'User'
    }
})
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
