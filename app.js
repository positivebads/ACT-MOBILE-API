/**
 * Author : Julius Abad
 * Date Created : January 2021
 * 
 */

require('dotenv').config()
const restify = require('restify')
var corsMiddleware = require('restify-cors-middleware');
const { dbconn } = require('./source/utility/db_utils')

//open the connection to the database
dbconn(function (err) {
    if (err)
        console.log(err);
    else
        console.log('MongoDB successfully connected to: ', process.env.MONGODB_URI);
});

//create server
//main interface through which you will register routes and handlers for incoming requests.
var cors = corsMiddleware({
    preflightMaxAge: 5,
    origins: ['*'],
    allowHeaders:['X-App-Version', 'x-access-token'],
    exposeHeaders:[]
});

var api = restify.createServer();
api.use(restify.plugins.acceptParser(api.acceptable));
api.use(restify.plugins.queryParser());
api.use(restify.plugins.bodyParser());
api.use(restify.plugins.gzipResponse());
api.pre(cors.preflight);
api.use(cors.actual);

var port = process.env.PORT || 5000;
api.listen(port, function () {
    console.log('Server started @ ' + port);
});

module.exports.api = api;

//Root route
api.get('/', function (req, res) { res.send(200, { msg: 'Welcome to ACT Mobile App API' }) });

//routes
require('./source/endpoints/mobile');
require('./source/endpoints/cms');
