const jwt = require('jsonwebtoken')
const { UnauthorizedError } = require('restify-errors')

async function validateToken (req, res, next) {
    let token = req.headers['x-access-token'] || null;
    let key = process.env.SECRET_KEY
    
    if(token) {
        jwt.verify(token, key, function(err, tokenData){
            if(!err){
                req.session_data = tokenData
                return next()
            }
            else{
                res.send(new UnauthorizedError("Invalid Token"));
            }
        })
    }
    else{
        res.send(new UnauthorizedError("Invalid Token"));
    }
}

module.exports = {
    validateToken
}