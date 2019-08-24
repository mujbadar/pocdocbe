const express = require('express')
const router = express.Router()
const Patient = require('../models/patient.js')
const Doctor = require('../models/doctor.js')
const bcrypt = require('bcrypt')

//Authenticating User login
router.post('/', (req, res) => {
  Patient.findOne({ userName: req.body.userName }, (error, foundPatient) => {
    if (foundPatient) {
      if (bcrypt.compareSync(req.body.password, foundPatient.password)) {
        console.log(foundPatient)
        res.status(200).json(foundPatient)
      } else if (error) {
        console.log('Not able to sign in');
        res.json({error: error.message})
      } else {
        console.log('300 error');
        res.status(300).json('error')
      }
    } else {
      Doctor.findOne({ userName: req.body.userName }, (error, foundDoctor) => {
        if (foundDoctor) {
          if (bcrypt.compareSync(req.body.password, foundDoctor.password)) {
            console.log(foundDoctor)
            res.status(200).json(foundDoctor)
          } else if (error) {
            console.log('Not able to sign in');
            res.json({error: error.message})
          } else {
            console.log('300 error');
            res.status(300).json('error')
          }
    }
  })
}
})
})

module.exports = router
