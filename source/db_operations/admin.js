const { 
    createRecord, 
    getOneRecordByEmail,
    getAllRecord,
    updateRecord,
    getOneRecordById
} = require('../utility/db_utils')

const sendGridService = require('../utility/email_utils')

const jwt = require('jsonwebtoken');
const generator = require('generate-password');
const bcrypt = require('bcrypt');
const saltRounds = 10;


async function createAdmin (req, res) {
    let payload = req.body
    payload.dateCreated = new Date()
    payload.status = 'Active'

    let email = await getOneRecordByEmail('act-db', 'act-cms-user', payload.email_address)

    if (email) {
        res.send({ code: 409, status: 'Duplicate Entry', msg: "Email address already exists", data: {}})
    } else {
        let password = generator.generate({
            length: 10,
            numbers: true
        });

        await bcrypt.genSalt(saltRounds, async function(err, salt) {
            await bcrypt.hash(password, salt, async function(err, hash) {
                
                if(err) throw err

                payload.password = hash
                let result = await createRecord('act-db', 'act-cms-user', payload)
                delete result.ops[0].password
                result.ops[0]._id = result.insertedId

                await sendGridService.send('positivebads@gmail.com', payload.email_address, 'ACT CMS Account Password', 
                `Hi ${payload.first_name}, <br/> <br/>
        
                Thank you for joining ACT. <br/>
        
                Here is your password : ${password} <br/><br/>
        
                Best regards, <br/>
                ACT Admin`)

                res.send({ code: 200, status: 'Ok', data: result.ops[0]})

            });
        });
    }    
}

async function getAllAdmin(req, res) {
    let result = await getAllRecord('act-db', 'act-cms-user')
    let admins = await result.toArray()

    let adminData = admins.map(elem => {
        return {
            fullName: elem.first_name + " " + elem.last_name,
            email: elem.email_address,
            mobile: elem.mobile,
            accountType: elem.account_type,
            status: elem.status
        }
    })
    
    res.send({ code: 200, status: 'Ok', data: adminData})
}

async function adminLogin (req, res) {
    let payload = req.body

    let user = await getOneRecordByEmail('act-db', 'act-cms-user', payload.username)

    console.log("user", user)

    if (user) {
        let match = await bcrypt.compare(payload.password, user.password);
        if(match){
            var token = jwt.sign(user, process.env.SECRET_KEY, { expiresIn: 60 * 60 });
            res.send({ code: 200, status: 'Ok', id: user._id, account_type: user.account_type, token: token})
        } else {
            res.send({ code: 401, status: 'Invalid', msg: "Username or password is invalid", data: {}})
        }
    } else {
        res.send({ code: 401, status: 'Invalid', msg: "Username or password is invalid", data: {}})
    }
}

async function forgotPassword (req, res) {

    let payload = req.body

    let user = await getOneRecordByEmail('act-db', 'act-cms-user', payload.email_address)

    if (user) {
        let password = generator.generate({
            length: 10,
            numbers: true
        });

        await bcrypt.genSalt(saltRounds, async function(err, salt) {
            await bcrypt.hash(password, salt, async function(err, hash) {
                
                if(err) throw err

                let result = await updateRecord('act-db', 'act-cms-user', payload.email_address, { password : hash })

                await sendGridService.send('positivebads@gmail.com', payload.email_address, 'ACT CMS password changed!', 
                `Hi ${user.first_name}, <br/> <br/>
        
                Your password was successfully updated. <br/>
        
                Here is your new password : ${password} <br/><br/>

                If you did not remember making this update, please contact your administrator and change your password immediately.<br/><br/>

                Thank you.<br/><br/>
        
                Best regards, <br/>
                ACT Admin`)

                res.send({ code: 200, status: 'Ok', data: {}})

            });
        }); 
    } else {
        res.send({ code: 401, status: 'Invalid', msg: "No user is associated with this email address", data: {}})
    }
}

async function changePassword (req, res) {

    let payload = req.body

    let user = await getOneRecordById('act-db', 'act-cms-user', payload.id)

    let match = await bcrypt.compare(payload.old_password, user.password);

    if(match) {
        if (user) {
            let password = payload.new_password
    
            await bcrypt.genSalt(saltRounds, async function(err, salt) {
                await bcrypt.hash(password, salt, async function(err, hash) {
                    
                    if(err) throw err
    
                    await updateRecord('act-db', 'act-cms-user', user.email_address, { password : hash })
                    res.send({ code: 200, status: 'Ok', msg: 'Password updated!', data: {}})
    
                });
            }); 
        } else {
            res.send({ code: 401, status: 'Invalid', msg: "User not found.", data: {}})
        }
    } else {
        res.send(409, { code: 409, status: 'Invalid', msg: "Old password did not match entered", data: {}})
    }
}

module.exports = {
    createAdmin,
    adminLogin,
    getAllAdmin,
    forgotPassword,
    changePassword
}