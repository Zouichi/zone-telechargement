const express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
const ZoneTelechargement = require('zone-telechargement');


var promise = mongoose.connect('mongodb://localhost:27017/zone-telechargement', {
    useMongoClient: true,
});
// quand la connexion est réussie
promise.then(
    () => {
        console.log('db.connected');
        // je démarre mon serveur node sur le port 3000
        server.listen(3000, function() {
            console.log('Example app listening on port 3000!')
            io.sockets.on('connection', function(socket) {
                console.log("un client est connecté");
            });
        });
    },
    err => {
        console.log('MONGO ERROR');
        console.log(err);
    }

);

// prend en charge les requetes du type ("Content-type", "application/x-www-form-urlencoded")
app.use(bodyParser.urlencoded({
    extended: true
}));
// prend en charge les requetes du type ("Content-type", "application/json")
app.use(bodyParser.json());

app.use('/static', express.static('/client/static'));

// serveur web
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/client/index.html')
});
app.post('/results/', function(req, res) {
    console.log("une requete est arrivée");
    console.log(req);
});


ZoneTelechargement.search('star wars')
    .then(results => {
        console.log(results);
        io.sockets.emit('monsocket');
    });

