const mongoose = require('mongoose');
const {Patient, Doctor} = require('./clinicSchema.js');

let express = require('express');
let app = express();
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static('images'));
app.use(express.static('css'));

app.use(express.urlencoded({extended: true}));
app.use(express.json());
var moment = require('moment');


mongoose.connect('mongodb://localhost:27017/libDB', function (err) {
    if (err) {
        console.log('Error in Mongoose connection');
        throw err;
    }
    console.log('Successfully connected');
    
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/homepage.html");
})

app.get('/newDoctor', function (req, res) {
    res.sendFile(__dirname + "/newDoctor.html");
})

app.post("/newDoctor", function (req, res) {
    console.log(req.body.date)
    let doctor1 = new Doctor({
        _id: new mongoose.Types.ObjectId(),
        fullName: { 
        firstName: req.body.fname,
        lastName: req.body.lname},
        dateOfBirth: new Date(req.body.date),
        address: {
            state: req.body.state,
            suburb: req.body.suburb,
            street: req.body.street,
            unit: req.body.unit
        },
        numPatients: req.body.numberofpatients
    });
    doctor1.save(function (err) {
        if(err){
            res.redirect("/error");
        }else{
            res.redirect("/listPatients");
        }
    });
});

app.get('/listDoctor', function (req, res) {
        Doctor.find({}, function (err, docs) {
            res.render('listDoctors.html', {db: docs, moment:moment});
            if (err){
                res.redirect("/error");
            }
          });
})

app.get('/newPatient', function (req, res) {
    res.sendFile(__dirname + "/newPatient.html");
})

app.post("/newPatient", function (req, res) {
    let patient1 = new Patient({
        _id: new mongoose.Types.ObjectId(),
        fullName: req.body.fullname,
        doctor: req.body.doctorid,
        age: req.body.age,
        dateOfVisit: new Date(req.body.date),
        caseDescription: req.body.caseDescription
    });
    patient1.save(function (err) {
        if(err){
            res.redirect("/error");
        }
        else {
            Doctor.findOneAndUpdate({_id :req.body.doctorid}, {$inc : {'numPatients' : 1}},function(err, result){
                if(err){
                    res.redirect("/error");
                }
                else{
                    res.redirect("/listPatients");
                }
            })
        }
    });
    


});

app.get('/listPatients', function (req, res) {
    Patient.find({}).populate('doctor','fullName.firstName fullName.lastName').exec(function (err, docs) {
        res.render('listPatients.html', {db: docs, moment:moment})
        if(err){
            res.redirect("/error");
        }
      });
})

app.get('/updateDoctor', function (req, res) {
    res.sendFile(__dirname + "/updateDoctor.html");
})

app.post("/updateDoctor", function (req, res) {
    Doctor.findOneAndUpdate({_id :req.body.doctorid}, {$set: {numPatients : req.body.patientno}},function(err, result){
        if(err){
            res.redirect("/error");
        }
        else{
            res.redirect("/listPatients");
        }
    })

});


app.get('/deletePatients', function (req, res) {
    res.sendFile(__dirname + "/deletePatients.html");
})

app.get('/error', function (req, res) {
    res.sendFile(__dirname + "/error404.html");
})

app.post("/deletePatients", function (req, res) {
    Patient.findOneAndRemove({fullName: {$eq: req.body.fullname} },function(err, result){
        if(err){
            res.redirect("/error");
        }
        else{
            res.redirect("/listPatients");
        }
    })

});

app.listen(8080);





