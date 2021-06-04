const api = module.parent.exports.api

const createUser = require('../db_operations/admin').createAdmin
const loginAdmin = require('../db_operations/admin').adminLogin
const forgotPassword = require('../db_operations/admin').forgotPassword
const getAllAdmin = require('../db_operations/admin').getAllAdmin
const changePassword = require('../db_operations/admin').changePassword

// reports
const genderCount = require('../db_operations/reports').genderCount
const severityCount = require('../db_operations/reports').severityCount
const totalCount = require('../db_operations/reports').totalCount
const ageRangeCount = require('../db_operations/reports').ageRangeCount

// admin operations - untokenized
api.post('/cms/login', loginAdmin)
api.post('/cms/forgot-password', forgotPassword)

// services
const validateToken = require('../service/jwt').validateToken

api.post('/cms/create-user', validateToken, createUser)
api.get('/cms/get-all', validateToken, getAllAdmin)
api.post('/cms/change-password', validateToken, changePassword)

// reports operations
api.post('/cms/gender-count', validateToken, genderCount)
api.post('/cms/severity-count', validateToken, severityCount)
api.post('/cms/total-count', validateToken, totalCount)
api.post('/cms/age-range-count', validateToken, ageRangeCount)
