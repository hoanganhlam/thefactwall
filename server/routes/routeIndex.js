const express = require('express');
const router = express.Router();
const {TaxonomyModel, UserModel, FactModel} = require('core-model');
var auth = require('./auth');

async function factPopular(user) {
    let query = {}
    if (user === null || (user && user.email !== 'lam@trip.vn')) {
        query['createdAt'] = {$lt: new Date()}
    }
    let aggregate = [
        {
            $addFields: {
                "isVoted": {
                    $filter: {
                        input: "$votes",
                        as: "vote",
                        cond: {$eq: ["$$vote.user", user ? user._id : null]}
                    }
                },
                "score": {$size: "$votes"}
            }
        },
        {
            $lookup: {from: 'taxonomies', localField: 'taxonomies', foreignField: '_id', as: 'taxonomies'}
        },
        {$lookup: {from: 'File', localField: 'photo', foreignField: '_id', as: 'photo'}},
        {$lookup: {from: 'User', localField: 'user', foreignField: '_id', as: 'user'}},
        {$unwind: "$user"},
        {
            $lookup: {
                from: "File",
                localField: 'user.avatar',
                foreignField: '_id',
                as: "user.avatar"
            }
        },
        {$project: {'user.hash': 0, 'user.salt': 0, 'user.email': 0}},
        {$sort: {score: -1, createdAt: -1}}
    ]
    const results = await FactModel.aggregate(aggregate)
    const display = await FactModel.aggregate(aggregate)
        .limit(3)
        .catch(err => {
            console.log(err);
        })
    return {
        results: display,
        currentPage: 1,
        total: results.length
    }
}

async function onThisDay(user, query) {
    let match = {}
    if (query.day) {
        match['day'] = query.day
    }
    if (query.month) {
        match['month'] = query.month
    }
    if (query.year) {
        match['year'] = query.year
    }
    let aggregate = [
        {
            $addFields: {
                "month": {$month: '$date'},
                "year": {$year: '$date'},
                "day": {$dayOfMonth: '$date'},
                "isVoted": {
                    $filter: {
                        input: "$votes",
                        as: "vote",
                        cond: {$eq: ["$$vote.user", user ? user._id : null]}
                    }
                },
                "score": {$size: "$votes"}
            }
        },
        {
            $lookup: {from: 'taxonomies', localField: 'taxonomies', foreignField: '_id', as: 'taxonomies'}
        },
        {$lookup: {from: 'File', localField: 'photo', foreignField: '_id', as: 'photo'}},
        {$lookup: {from: 'User', localField: 'user', foreignField: '_id', as: 'user'}},
        {$unwind: "$user"},
        {
            $lookup: {
                from: "File",
                localField: 'user.avatar',
                foreignField: '_id',
                as: "user.avatar"
            }
        },
        {
            $match: match
        },
        {$project: {'user.hash': 0, 'user.salt': 0, 'user.email': 0}},
        {$sort: {score: -1}}
    ]
    const results = await FactModel.aggregate(aggregate)
    const display = await FactModel.aggregate(aggregate)
        .limit(10)
        .catch(err => {
            console.log(err);
        })
    return {
        results: display,
        currentPage: 1,
        total: results.length
    }
}

async function factNew(user, page) {
    let query = {}
    if (user === null || (user && user.email !== 'lam@trip.vn')) {
        query['createdAt'] = {$lt: new Date()}
    }
    let aggregate = [
        {
            $addFields: {
                "isVoted": {
                    $filter: {
                        input: "$votes",
                        as: "vote",
                        cond: {$eq: ["$$vote.user", user ? user._id : null]}
                    }
                },
            }
        },
        {$lookup: {from: 'taxonomies', localField: 'taxonomies', foreignField: '_id', as: 'taxonomies'}},
        {$lookup: {from: 'File', localField: 'photo', foreignField: '_id', as: 'photo'}},
        {$lookup: {from: 'User', localField: 'user', foreignField: '_id', as: 'user'}},
        {$unwind: "$user"},
        {
            $lookup: {
                from: "File",
                localField: 'user.avatar',
                foreignField: '_id',
                as: "user.avatar"
            }
        },
        {
            $match: query
        },
        {$project: {'user.hash': 0, 'user.salt': 0, 'user.email': 0}},
        {$sort: {createdAt: -1}}
    ]
    const results = await FactModel.aggregate(aggregate)
    const display = await FactModel.aggregate(aggregate)
        .skip(10 * (page - 1))
        .limit(10)
        .catch(err => {
            console.log(err);
        })
    return {
        results: display,
        currentPage: 1,
        total: results.length
    }
}

async function taxonomies() {
    let query = {}
    const results = await TaxonomyModel.find(query)
    const display = await TaxonomyModel.find(query)
        .populate({path: 'facts', populate: {path: 'photo', model: 'File'}})
        .limit(6)
        .catch(err => {
            console.log(err);
        })
    return {
        results: display.map(x => x.toJsonFor()),
        currentPage: 1,
        total: results.length
    }
}

async function contributors() {
    let query = {}
    const results = await UserModel.find(query)
    const display = await UserModel.find(query)
        .limit(4)
        .catch(err => {
            console.log(err);
        })
    return {
        results: display,
        currentPage: 1,
        total: results.length
    }
}


/* GET home page. */
router.get('/', auth.optional, async (req, res, next) => {
    const page = Number.parseInt(req.query.page) || 1
    const day = Number.parseInt(req.query.day) || null
    const month = Number.parseInt(req.query.month) || null
    const year = Number.parseInt(req.query.year) || null

    let user = await UserModel.findById(req.payload ? req.payload.id : null).catch(next);
    let n = await factNew(user, page)
    let p = await factPopular(user)
    let t = await taxonomies()
    let c = await contributors()
    let d = await onThisDay(user, {'day': day, 'month': month, 'year': year})
    let count = await FactModel.count()
    let rand = Math.floor(Math.random() * count);
    let r = await FactModel.findOne()
        .populate('user')
        .populate({
            path: 'taxonomies',
            populate: {
                path: 'facts', populate: {path: 'photo', model: 'File'}
            }
        })
        .populate('photo')
        .skip(rand);
    return res.json({
        n, p, t, c, d, r: r ? r.toJSONFor(user) : null
    })
});

router.post('/', auth.required, (req, res, next) => {

});

router.get('/reset', (req, res, next) => {
    var mongoose = require('mongoose');
    /* Connect to the DB */
    mongoose.connection.db.dropDatabase();
    return res.json({stt: 'done'})
});


module.exports = router;
