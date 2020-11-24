const mongoose = require('mongoose')

const scheduleAppointment = new mongoose.Schema({
    date :{
        type: Date,
        required: true
    },
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    },
    company:{
        type:String,
        required:true
    }
})

module.exports  = mongoose.model('scheduleAppointment',scheduleAppointment)
