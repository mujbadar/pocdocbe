const express = require('express')
const router = express.Router()
const Patient = require('../models/patient.js')
const bcrypt = require('bcrypt')

// Get all Patients
router.get('/', (req, res) => {
    Patient.find({}, (error, allUsers) => {
      if (error) {
        res.status(400).json({error: error.message})
      }else {
        res.status(200).json(allUsers)
      }
    })
})

// //Get route to visit other user profiles
// router.get('/:id', (req, res) => {
//   User.findOne({_id: req.params.id}, (error, foundProf) => {
//     if (error) {
//       res.status(400).json({error: error.message})
//     }else {
//       console.log(foundProf);
//       res.status(200).json(foundProf)
//     }
//   })
// })


//Edit route for Patients.
router.put('/:id/edit', (req, res) => {
  console.log(req.params.id);
  Patient.findByIdAndUpdate(req.params.id, req.body, {new:true}, (error, updateUser) => {
    if (error) {
      console.log('there was an error');
      res.json({error: error.message})
    } else {
      res.status(200).json(updateUser)
      console.log(updateUser);
    }
  })
})

//DELETE PATIENT
router.delete('/:id', (req, res) => {
  Patient.findByIdAndRemove(req.params.id, (error, deleteUser) => {
    if (error) {
      res.status(400).json({error: error.message})
    } else {
      res.status(200).json('User deleted')
    }
  })
})

//Create new Patient
router.post('/new', (req, res) => {
  console.log(req.body)
  req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
  Patient.create(req.body, (error, newUser) => {
    if (error) {
      res.status(400).json({error: error.message})
    }else {
      res.status(200).json(newUser)
    }
  })
})

module.exports = router
