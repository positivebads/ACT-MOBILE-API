const { 
    createRecord, 
    getOneRecordById,
    getAllRecord
} = require('../utility/db_utils')

async function createUser (req, res) {
    let payload = req.body
    payload.dateCreated = new Date()

    let result = await createRecord('act-db', 'act-user', payload)
    result.ops[0]._id = result.insertedId

    res.send({ code: 200, status: 'Ok', data: result.ops[0]})
}

async function getUserbyId(req, res) {
    let recordId = req.params.id
    let result = await getOneRecordById('act-db', 'act-user', recordId)
    res.send({ code: 200, status: 'Ok', data: result})
}

async function getAllUser(req, res) {

    let range = {
        start: req.body.startDate ? req.body.startDate : undefined,
        end: req.body.endDate ? req.body.endDate : undefined
    }

    let result = await getAllRecord('act-db', 'act-user', range)
    res.send({ code: 200, status: 'Ok', data: await result.toArray()})
}



module.exports = {
    createUser,
    getUserbyId,
    getAllUser
}