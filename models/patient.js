const mongoose = require('mongoose')
const Schema = mongoose.Schema

const patientSchema = new Schema({
  type: String,
  userName: { type:String, require:true, unique: true },
  password: { type: String, require:true },
  firstName: { type: String, require: true},
  lastName: { type: String, require: true},
  email: {type: String, require: true},
  state: String,
  img: String,
  info: String,
  history: []
  })

const Patient = mongoose.model('Patient', patientSchema)
module.exports = Patient
