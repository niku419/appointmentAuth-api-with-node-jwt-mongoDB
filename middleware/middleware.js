const db = require('../models/db')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt')
const Nexmo = require('nexmo')
const secret = 'secret'

exports.scheduleAppointment = async function(req,res){
    try{
        var existingDate = await db.scheduleAppointment.findOne({
            date: req.body.date
        })
        if(existingDate){
        return res.status(401).json({
            message: "An Appointment is already Scheduled"
        })
        }else{    
            var user = await db.scheduleAppointment.create({
                date: req.body.date,
                from:req.body.from,
                to: req.body.to,
                company: req.body.company,
            })
            await user.save()
            console.log(user)
            for(var i=parseInt(user.from);i<parseInt(user.to);i++){
                await db.scheduleSlots.create({
                    date: req.body.date,
                    from: i,
                    to: i+1,
                    company: req.body.company,
                    booked: false
                })
            }
            await db.scheduleSlots.find({
                company: req.body.company,
                date:req.body.date
            })
            .then(function(slots){
                res.json(slots)
            })
            .catch(function(err){
                res.send(err)
            })
        }
    }catch(err){
        throw err
    }
}

exports.detailsForConfirmation = function(req,res){
    let mailTransporter = nodemailer.createTransport({ 
        service: 'gmail', 
        auth: { 
            user: 'supernicky659@gmail.com', 
            pass: '9438002199Ni.'
        } 
    })
    let mailDetails = { 
        from: 'supernicky659@gmail.com', 
        to: req.body.email,
        subject: 'Appointment Confirmed', 
        text: 'Hello ' + req.body.name +' Your request for Appointment has been confirmed on '+ req.body.date + ' with ' + req.body.company + '. Thank you for using my App'
    }
    mailTransporter.sendMail(mailDetails, function(err, data) { 
        if(err) { 
            console.log('Error Occurs')
        } else { 
            console.log('Email sent successfully')
        } 
    })
    const nexmo = new Nexmo({ 
        apiKey: '0812e02d',
        apiSecret: 'goOBkGY13pxkARTk', 
    }); 
    const from = 'Nicky'; 
    const to = req.body.phonenumber; 
    const text = 'Hello ' + req.body.name +' Your request for Appointment has been confirmed on '+ req.body.date + ' with ' + req.body.company + '. Thank you for using my App'; 
    nexmo.message.sendSms(from, to, text, function(error, result){ 
        if(error) { 
            console.log("ERROR", error) 
        }
        else { 
            console.log("Text message Sent successfully") 
        } 
    })
    res.redirect('/')
}
exports.getAppointment = async function(req,res,next){
    try{
        await db.scheduleSlots.find({
            company:req.body.company,
            date: new Date(req.body.date),
            booked:false
        }).then(function(availabeSlots){
            if(availabeSlots){   
            res.json(availabeSlots)
        }else{
            res.json({"message":"No Appointments Scheduled in that time"})
        }
        })
        .catch(function(err){
            res.send(err)
        })
    }catch(err){
        throw err
    }
}
exports.API = async function(req,res,next){
    try{
        await db.scheduleSlots.find()
        .then(function(availabeSlots){
            if(availabeSlots){   
            res.json(availabeSlots)
        }else{
            res.json({"message":"No Appointments Scheduled"})
        }
        })
        .catch(function(err){
            res.send(err)
        })
    }catch(err){
        throw err
    }
}
exports.fixAppointment = async function(req,res,next){
    try{
        let foundSlot = await db.scheduleSlots.findOneAndUpdate({
            _id: new Object(req.params.id),
            booked:false
        },
        {
            booked:true
        })
        console.log(foundSlot)
        if(foundSlot){
            res.send('<form action="/detailsForConformation" method="POST">' +
        '<input name="email" type="email" placeholder="email"/>' +
        '<input name="name" type="text" placeholder="name"required>'+
        '<input name="phonenumber" type="number" placeholder="contact number"required>'+
        '<input type="hidden" name="date" value="' + foundSlot.date + '" />' +
        '<input type="hidden" name="company" value="' + foundSlot.company + '" />' +
        '<input type="submit" value="Reset Password" />' +
    '</form>')
        }else{
            res.json({
                message: "You selected an invalid slot"
            })
        }
    }catch(err){
        throw err
    }
}

exports.companySignup = async function(req,res,next){
    try{
        var existingCompany = await db.Company.findOne({company: req.body.company})
        var existingEmail = await db.Company.findOne({email: req.body.email})
        if(existingCompany || existingEmail){
            return res.status(401).json({
                message: "Company already in DB"
            })
        }else{    
        var result = await db.Company.create({
            company: req.body.company,
            email: req.body.email,
            password: req.body.password,
        })
        await result.save()
        console.log(result)
        var {company, email, password} = result
        let token = jwt.sign({
            company,
            email,
            password
        },secret)
        console.log(token)
        return res.status(200).json({
            company,
            email,
            password,
            token
        })}
    }catch (err) {
        if (err.code === 11000) {
        err.message = "Sorry, that username and/or email is taken"
        }
        return next({
        status: 400,
        message: err.message
        });
    }
}
exports.userSignup = async function(req,res,next){
    try{
        var existingEmail = await db.User.findOne({email: req.body.email})
        if(existingEmail){
            return res.status(401).json({
                message: "User already in DB"
            })
        }else{    
        var result = await db.User.create(req.body)
        var {email, password} = result
        let token = jwt.sign({
            email,
            password
        },secret)
        return res.status(200).json({
            email,
            password,
            token
        })}
    }catch (err) {
        if (err.code === 11000) {
        err.message = "Sorry, that username and/or email is taken"
        }
        return next({
        status: 400,
        message: err.message
        });
    }
}

exports.userSignin = async function(req, res, next) {
    try{
    let user = await db.User.findOne({email: req.body.email})
    console.log(user)
    let isMatch = await user.comparePassword(req.body.password)
    let {email, password} = user;
    if(isMatch){
        let token = jwt.sign({
        email,
        password
        },secret)
        return res.status(200).json({
        email,
        password,
        token
        })
    }else{
        return res.status(400).json({
            status: 400,
            message: "Error occured"
        })
    }
    }
    catch(err){
    return res.status(400).json({
        status: 400,
        message: "Error occured try again"
    })
    }
}

exports.companySignin = async function(req, res, next) {
    try{
    let result = await db.Company.findOne({email: req.body.email})
    console.log(result)
    let isMatch = await result.comparePassword(req.body.password)
    let {email, company,password} = result;
    if(isMatch){
        let token = jwt.sign({
        email,
        password,
        company
        },secret)
        return res.status(200).json({
        email,
        company,
        password,
        token
        })
    }else{
        return res.status(400).json({
            status: 400,
            message: "Error occured"
        })
    }
    }
    catch(err){
    return res.status(400).json({
        status: 400,
        message: "Error occured try again"
    })
    }
}

exports.forgotPassword = async function(req,res,next){
    var user = await db.User.findOne({email: req.body.email})
    var id = await user._id
    var secret = (await user).password.split('/')[1]
    var url = 'http://localhost:3001/resetPassword/' + id + '/' + secret
    try{
        if(!user){
            return res.status(400).json({error:"User not found"})
        }else{
            let mailTransporter = nodemailer.createTransport({ 
                service: 'gmail', 
                auth: { 
                    user: 'supernicky659@gmail.com', 
                    pass: '9438002199Ni.'
                } 
            })
            let mailDetails = { 
                from: 'supernicky659@gmail.com', 
                to: req.body.email, 
                subject: 'You requested for password reset and click on the url for password reset', 
                text: url
            }
            mailTransporter.sendMail(mailDetails, function(err, data) { 
                if(err) { 
                    console.log('Error Occurs')
                } else { 
                    console.log('Email sent successfully')
                } 
            })
            res.json({message: "Email sent successfully"})
        }
    }catch(err){
        return res.status(400).json({error:"User not found"})
    }
}

exports.resetPassword = async function(req,res){
    try{
    console.log(req.body.id)
    var hashedPassword = await bcrypt.hash(req.body.password,10)
    await db.User.findOneAndUpdate({_id: req.body.id},{password: hashedPassword})
    var user = await db.User.findById({_id : req.body.id})
    console.log(user.password)
    res.status(200).json(user)
    res.redirect('/')
    }catch(err){
        throw err
    }
}

exports.loginRequired = function(req,res,next){
    console.log(1)
    console.log(req.headers.authorization)
    try{
        const token = req.headers.authorization.split(" ")[1]
        jwt.verify(token, secret, function(err,decoded){
            console.log(token)
            console.log(decoded)
            if(decoded){
                return next()
            }else{
                return next({
                    status:401,
                    message:"Login first"
                })
            }
        })
    }catch(err){
        return next({
            status:401,
            message:"Login first"
        })
    }
}   

exports.ensureCorrectUser =async function(req,res,next){
    try{
        let token =await req.headers.authorization
        jwt.verify(token, secret, function(err, decoded){
        if(decoded && decoded.id === req.params.id){
            return next()
        }else{
            return next({
                status: 401,
                message: "Unauthorized"
            })
        }
    })
    }catch(err){
        return next({
            status: 401,
            message: "Unauthorized"
        })
    } 
}