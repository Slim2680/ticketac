var mongoose = require('mongoose')

var options = {
    connectTimeoutMS: 5000,
    useUnifiedTopology: true,
    useNewUrlParser: true,
}

mongoose.connect('mongodb+srv://admin:doggito@cluster0.jcrjh.mongodb.net/ticketac?retryWrites=true&w=majority',
    options,
    function(error) {
        if (error){
            console.log("Ooooops!! Error") ;
        } else {
            console.log("It's all GOOOOOD!!!!");
        }
    }
)

module.exports = mongoose