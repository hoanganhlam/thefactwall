const express = require('express');
const router = express.Router();
const {TaxonomyModel, UserModel, FactModel} = require('core-model');
var auth = require('./auth');

async function factPopular(user) {
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
        {$unwind:"$user"},
        {
            $lookup: {
                from: "File",
                localField: 'user.avatar',
                foreignField: '_id',
                as: "user.avatar"
            }
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

async function factNew(user) {
    let query = {}
    const results = await FactModel.find(query)
    const display = await FactModel.find(query)
        .populate('user')
        .populate('taxonomies')
        .limit(1)
        .sort({createdAt: -1})
        .catch(err => {
            console.log(err);
        })
    return {
        results: display.map((x) => {
            return x.toJSONFor(user)
        }),
        currentPage: 1,
        total: results.length
    }
}

async function taxonomies() {
    let query = {}
    const results = await TaxonomyModel.find(query)
    const display = await TaxonomyModel.find(query).populate({path: 'facts', populate: {path: 'photo', model: 'File'}})
        .limit(4)
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
    let user = await UserModel.findById(req.payload ? req.payload.id : null).catch(next);
    let n = await factNew(user)
    let p = await factPopular(user)
    let t = await taxonomies()
    let c = await contributors()
    return res.json({
        n, p, t, c
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
