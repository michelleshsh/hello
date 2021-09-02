const mongoose = require('mongoose');

const nameSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
    }
  });

const AddressSchema = mongoose.Schema({
    state: {
        type: String,
        minLength: 2,
        maxLength: 3
    },
    suburb: String,
    street: String,
    unit: String 
  });
  

let doctorSchema = mongoose.Schema({
    fullName: {
        type: nameSchema
    },
    dateOfBirth: {
        type: Date
    },
    address: {
        type: AddressSchema
    },
    numPatients:{
        type: Number,
        validate: {
            validator: (numPatients) => {
                return numPatients >= 0 && Number.isInteger(numPatients);
            },
            message: 'Number of Patients should be a positive number'
        }
    }
});

let patientSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor'
    },
    age: { type: Number, min: 0, max: 120 },
    dateOfVisit: {
        type: Date,
        default: Date.now
    },
    caseDescription: {
        type: String,
        minLength: 10
    }
});

module.exports.Patient = mongoose.model('Patient', patientSchema);
module.exports.Doctor = mongoose.model('Doctor', doctorSchema);
