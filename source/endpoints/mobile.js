const api = module.parent.exports.api

const createUser = require('../db_operations/user').createUser
const getUserById = require('../db_operations/user').getUserbyId
const getAllUser = require('../db_operations/user').getAllUser

api.post('/create-user', createUser)
api.get('/fetch-user/:id', getUserById)
api.post('/fetch-user/all', getAllUser)