const mongoose = require('mongoose')
const Schema = mongoose.Schema

const visitSchema = new Schema({
complaint: { type:String, require:true},
type: { type: String, require:true },
symptoms: [],
patient: { type: String },
desc: {type: String, require: true},
urgent: {type: Boolean, require: true},
duration: {type: String, require: true},
info: String,
})

const Visit = mongoose.model('Visit', visitSchema)
module.exports = Visit
