const express = require('express')
const bodyParser = require('body-parser')
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
    loginRequired
} = require('./middleware/middleware')

const port = 3001
const app = express()

app.set('view engine','ejs')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(express.json())

app.get('/',(req,res) => res.render('index.ejs'))
app.get('/scheduleAppointment',loginRequired, (req,res) => res.render('scheduleAppointment.ejs'))
app.get('/getAppointment',loginRequired,(req,res) => res.render('getAppointment.ejs'))
app.get('/companySignup',(req,res) => res.render('companySignup.ejs'))
app.get('/userSignup',(req,res) => res.render('userSignup.ejs'))
app.get('/companySignin',(req,res) => res.render('companySignin.ejs'))
app.get('/userSignin', (req,res) =>  res.render('userSignin.ejs'))
app.get('/getAppointment/:id',loginRequired,fixAppointment)
app.get('/api',API)
app.post('/scheduleAppointment',scheduleAppointment)
app.post('/getAppointment', getAppointment)
app.post('/detailsForConfirmation',detailsForConfirmation)
app.post('/companySignup',companySignup)
app.post('/companySignin',companySignin)
app.post('/userSignup',userSignup)
app.post('/userSignin',userSignin)

app.listen(port,function(req,res){
    console.log("Server started on 3001")
})