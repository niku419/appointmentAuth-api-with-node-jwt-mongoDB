const mongoose = require('mongoose')

const scheduleSlots = new mongoose.Schema({
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
        type: String
    },
    booked: false
})

module.exports  = mongoose.model('scheduleSlots',scheduleSlots)