var mongoose = require('mongoose')

var myticketSchema = mongoose.Schema({
    from: String,
    to: String,
    date: Date,
    departureTime: Date,
    price: Number
})

var myTicketModel = mongoose.model('tickets', myticketSchema)

module.exports = myTicketModel