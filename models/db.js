const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/appointment1',{
    useUnifiedTopology:true,
    useNewUrlParser: true
},function(err){
    if(err){        
    console.log(err)
    }
})

module.exports.User = require('./userModel')
module.exports.Company = require('./companyModel')
module.exports.scheduleAppointment = require('./AppointmentModel')
module.exports.scheduleSlots = require('./slotModel')