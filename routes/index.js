var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var userModel = require('../models/users')
var travelModel = require('../models/travels')
var myTicketModel = require('../models/mytickets')

var journeySchema = mongoose.Schema({
  departure: String,
  arrival: String,
  date: Date,
  departureTime: String,
  price: Number,
});

var journeyModel = mongoose.model('journey', journeySchema);

var city = ["Paris","Marseille","Nantes","Lyon","Rennes","Melun","Bordeaux","Lille"]
var date = ["2018-11-20","2018-11-21","2018-11-22","2018-11-23","2018-11-24"]



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login');
});


// Remplissage de la base de donnée, une fois suffit
router.get('/save', async function(req, res, next) {

  // How many journeys we want
  var count = 300

  // Save  ---------------------------------------------------
    for(var i = 0; i< count; i++){

    departureCity = city[Math.floor(Math.random() * Math.floor(city.length))]
    arrivalCity = city[Math.floor(Math.random() * Math.floor(city.length))]

    if(departureCity != arrivalCity){

      var newUser = new journeyModel ({
        departure: departureCity , 
        arrival: arrivalCity, 
        date: date[Math.floor(Math.random() * Math.floor(date.length))],
        departureTime:Math.floor(Math.random() * Math.floor(23)) + ":00",
        price: Math.floor(Math.random() * Math.floor(125)) + 25,
      });
       
       await newUser.save();

    }

  }
  res.render('index');
});


// Cette route est juste une verification du Save.
// Vous pouvez choisir de la garder ou la supprimer.
// router.post('/result', function(req, res, next) {

//   // Permet de savoir combien de trajets il y a par ville en base
//   for(i=0; i<city.length; i++){

//     journeyModel.find( 
//       { departure: city[i] } , //filtre
  
//       function (err, journey) {

//           console.log(`Nombre de trajets au départ de ${journey[0].departure} : `, journey.length);
//       }
//     )

//   }

router.post('/result', async function(req, res, next) {

    req.session.from = req.body.from
  var Sfrom = req.session.from
    req.session.to = req.body.to
  var Sto = req.session.to
    req.session.date = req.body.date
  var Sdate = req.session.date

  var travelsAvailable = await travelModel.find({
    departure: Sfrom,
    arrival: Sto,
    date: Sdate
  })

  if (travelsAvailable.length === 0) {
    res.redirect('/notfound')
  } else {
    res.render('trips', {travelsAvailable});
  }

});

router.get('/notfound', function(req, res, next) {
  res.render('notfound')
})

router.get('/orders', async function(req, res, next) {

  var newTicket = new myTicketModel({
    from: req.session.from,
    to: req.session.to,
    date: req.session.date,
    departureTime: req.session.date,
    price: 123
  })

  await newTicket.save()

  res.render('orders', {
    from: req.session.from,
    to: req.session.to,
    date: req.session.date,
  })
})

//   res.render('trips');
// });

// // GET TRIPS PAGE

// router.get('/trips', function(req, res, next) {

//   res.render('trips')
// })

// GET HOME PAGE

router.get('/home', function(req, res, next) {
  res.render('home')
})

router.post('/sign-up', async function(req, res, next) {

  var newUser = new userModel({
    name: req.body.SUname,
    firstname: req.body.SUfirstname,
    email: req.body.SUemail,
    password: req.body.SUpassword
  })

  var alreadyMember = await userModel.findOne({
    email: req.body.SUemail,
  })

  if (!alreadyMember) {
    await newUser.save()
    res.redirect('/home')
  } else {
    res.redirect('/')
  }

})

router.post('/sign-in', async function(req, res, next) {

  var registeredUser = await userModel.findOne({
    email: req.body.SIemail,
    password: req.body.SIpassword
  })

  if (registeredUser) {

    var actualUser = await userModel.findOne({email: req.body.SIemail})
    console.log('__ username', actualUser.name)

    res.redirect('/home')
  } else {
    res.redirect('/')
  }

})


module.exports = router;
