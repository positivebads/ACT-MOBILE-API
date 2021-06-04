const { MongoClient } = require('mongodb');
var mongoose = require('mongoose');
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}/act-database?retryWrites=true&w=majority`
const client = new MongoClient(uri, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
});

async function dbconn() {
    try {
        await client.connect();
    } catch (e) {
        console.error(e);
    }
}

async function createRecord(database, table, payload) {
    const result = await client.db(database).collection(table).insertOne(payload);
    console.log(`New listing created with the following id: ${result.insertedId}`);
    return result
}

async function getOneRecordById(database, table, recordId) {
    const fetchResult = await client.db(database).collection(table).findOne({ _id : mongoose.Types.ObjectId(recordId) })
    if (fetchResult) {
        console.log(`Found a listing in the collection with the ID '${recordId}':`);
    } else {
        console.log(`No listings found with the ID '${recordId}'`);
    }

    return fetchResult
}

async function getOneRecordByEmail(database, table, email) {
    const fetchResult = await client.db(database).collection(table).findOne({ email_address : email })
    if (fetchResult) {
        console.log(`Record found`);
    } else {
        console.log(`No record found`);
    }

    return fetchResult
}

async function getAllRecord(database, table, range) {
    try {

        const fetchAllResult = await client.db(database).collection(table).find({})

        if (fetchAllResult) {
            console.log(`Found a listing in the collection`);
        } else {
            console.log(`No listings found`);
        }

        return fetchAllResult

    } catch (err) {
        throw err
    }
}

async function updateRecord(database, table, email, updateData) {
    const fetchResult = await client.db(database).collection(table).findOneAndUpdate({ email_address : email }, { $set: updateData })
    
    if (fetchResult) {
        console.log(`Password updated`);
    } else {
        console.log(`Password cannot be changed`);
    }

    return fetchResult
}

module.exports = {
    dbconn,
    createRecord,
    getOneRecordById,
    getOneRecordByEmail,
    getAllRecord,
    updateRecord
}