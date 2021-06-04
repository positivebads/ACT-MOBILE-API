const {
    getAllRecord
} = require('../utility/db_utils')

async function genderCount (req, res) {
    // let range = {
    //     start: req.body.startDate ? req.body.startDate : undefined,
    //     end: req.body.endDate ? req.body.endDate : undefined
    // } ====> to be fixed

    let gender = await getAllRecord('act-db', 'act-user')
    let genderArr = await gender.toArray()

    let maleCount = 0, femaleCount = 0

    await genderArr.map(elem => {
        
        let { personal_information } = elem
        let { gender } = personal_information

        if(gender == 'Female') {
            femaleCount = femaleCount + 1
        } else {
            maleCount = maleCount + 1
        }
    })

    res.send({ code: 200, status: 'Ok', data: { male: maleCount, female: femaleCount } })
}

async function severityCount (req, res) {

    // let range = {
    //     start: req.body.startDate ? req.body.startDate : undefined,
    //     end: req.body.endDate ? req.body.endDate : undefined
    // }

    // let gender = await getAllRecord('act-db', 'act-user')
    // let genderArr = await gender.toArray()

    // let low = 0, mild = 0, high = 0, severe = 0

    // await genderArr.map(elem => {
        
    //     let { health_information } = elem
    //     let { 
    //         cough,
    //         diarrhea,
    //         diff_breathing,
    //         fever,
    //         headache,
    //         loss_taste_smell,
    //         muscle_pain,
    //         runny_nose,
    //         sore_throat
    //      } = personal_information

    //     if(diff_breathing == 1) {
    //         femaleCount = femaleCount + 1
    //     } else {
    //         maleCount = maleCount + 1
    //     }
    // })

    let severity = {
        label : [
            'Low',
            'Mild',
            'High',
            'Severe'
        ],
        data: [
            19,0,0,3
        ]  
    }
    res.send({ code: 200, status: 'Ok', data: severity })
}

async function ageRangeCount (req, res) {

    let range = {
        start: req.body.startDate ? req.body.startDate : undefined,
        end: req.body.endDate ? req.body.endDate : undefined
    }

    let ageRange = {
        label : [
            '21 years old and below',
            'Ages 22 to 35',
            'Ages 36 to 50',
            'Ages 51 to 64',
            '65 years old and above'
        ],
        data: [
            0,4,1,5,0
        ]  
    }

    res.send({ code: 200, status: 'Ok', data: ageRange })
}

async function totalCount (req, res) {
    
    let flag = req.body.filter

    if(!flag) {
        res.send({ code: 404, status: 'Conflict', msg: 'Data filter is required.', data: {} })
    } else {
        let countData = {}
        if(flag == 'Daily') {
            countData = {
                label: [
                    'Sunday',
                    'Monday',
                    'Tuesday',
                    'Wednesday',
                    'Thursday',
                    'Friday',
                    'Saturday'
                ],
                data: [
                    0,0,0,20,0,0,0
                ]
            }
        } else if (flag == 'Weekly') {
            countData = {
                label: [
                    'Week1',
                    'Week2',
                    'Week3',
                    'Week4'
                ],
                data: [
                    20,0,0,0
                ]
            }
        } else if(flag == 'Monthly'){
            countData = {
                label: [
                    'January',
                    'February',
                    'March',
                    'April',
                    'May',
                    'June',
                    'July',
                    'August',
                    'September',
                    'October',
                    'November',
                    'December'
                ],
                data: [
                    0,0,0,0,0,20,0,0,0,0,0,0
                ]
            }
        } else {
            countData = {
                label: [
                    'Year1',
                    'Year2',
                    'Year3',
                    'Year4'
                ],
                data: [
                    20,0,0,0
                ]
            }
        }
        res.send({ code: 200, status: 'Ok', data: countData })
    }
}

module.exports = {
    genderCount,
    severityCount,
    ageRangeCount,
    totalCount
}