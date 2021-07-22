const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://Niku_419:9438002199Ni.@appointmentapi.cyly9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{
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