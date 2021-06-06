const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const {
    userSignin,
    userSignup,
    companySignup,
    companySignin,
    getAppointment,
    fixAppointment,
    scheduleAppointment,
    detailsForConfirmation,
    API,
    loginRequired,
    userLoginRequired,
    companyloginRequired,
    showAppointment,
    deleteAppointment
} = require('./middleware/middleware')

const port = 3001
const app = express()

app.set('view engine','ejs')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(express.json())
app.use(
    cors({
    origin: '*'
}))

app.get('/',(req,res) => res.render('index.ejs'))
app.get('/scheduleAppointment',companyloginRequired, (req,res) => res.render('scheduleAppointment.ejs'))
app.get('/getAppointment',userLoginRequired, (req,res) => res.render('getAppointment.ejs'))
app.get('/companySignup',(req,res) => res.render('companySignup.ejs'))
app.get('/userSignup',(req,res) => res.render('userSignup.ejs'))
app.get('/companySignin',(req,res) => res.render('companySignin.ejs'))
app.get('/userSignin', (req,res) =>  res.render('userSignin.ejs'))
app.get('/getAppointment/:id',userLoginRequired, fixAppointment)
app.get('/api',loginRequired ,API)
app.get('/deleteAppointment',userLoginRequired,showAppointment)
app.get('/deleteAppointment/:id',userLoginRequired,deleteAppointment)
app.post('/scheduleAppointment',companyloginRequired, scheduleAppointment)
app.post('/getAppointment',getAppointment)
app.post('/detailsForConfirmation',detailsForConfirmation)
app.post('/companySignup',companySignup)
app.post('/companySignin',companySignin)
app.post('/userSignup',userSignup)
app.post('/userSignin',userSignin)

app.listen(port,function(req,res){
    console.log(`server started on ${port}`)
})