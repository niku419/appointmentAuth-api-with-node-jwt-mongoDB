const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const Company = new mongoose.Schema({
    company:{
        type: String,
        required: true
    },
    email:{
        type:String,
        required: true
    },
    password:{
        type: String,
        required:true
    }
})

Company.pre('save', async function(next){
    try{
        if(!this.isModified('password')){
            return next()
        }
        var hashedPassword = await bcrypt.hash(this.password,10)
        this.password = hashedPassword
        return next()
    }catch(err){
        return next(err)    
    }
})

Company.methods.comparePassword = async function(candidatePassword, next){
    try{
        let isMatch = await bcrypt.compare(candidatePassword, this.password)
        return isMatch
    }catch(err){
        return next(err)
    }
}

module.exports  = mongoose.model('Company',Company)