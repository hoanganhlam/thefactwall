const {FactModel, UserModel, TaxonomyModel} = require('core-model');
const {responseError} = require('./response');
const {getBody} = require('./request');
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId;

const escapeRegex = (string) => {
    return string.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

exports.create = async (req, res, next) => {
    let user = await UserModel.findById(req.payload.id).catch(next);
    if (!user) {
        return res.sendStatus(401);
    }
    let data = getBody(req, [
        'title', 'contentLong', 'taxSlugs', 'photo',
        'contentShort', 'source', 'taxonomies', 'date']);

    try {
        let test = await FactModel.find({contentShort: data.contentShort});
        if (test.length) {
            return res.json(test[0]);
        }
        let instance = new FactModel(data)
        if (data.taxSlugs && data.taxSlugs.length) {
            let taxonomies = await TaxonomyModel.find({'slug': {$in: data.taxSlugs}})
            instance.taxonomies = taxonomies.map(x => x._id)
        }
        instance.user = user
        await instance.save().then(() => {
            return res.json(instance)
        })

    } catch (error) {
        let message = error && error.message ? error.message : 'Error';
        return responseError(res, message, {messageCode: 'error_get_user'});
    }
};

exports.list = async (req, res, next) => {
    let user = await UserModel.findById(req.payload ? req.payload.id : null).catch(next);
    const pageSize = Number.parseInt(req.query.pageSize) || 9;
    const day = Number.parseInt(req.query.day),
        month = Number.parseInt(req.query.month),
        year = Number.parseInt(req.query.year)
    const searchQuery = req.query.search || ''
    const page = req.query.page || 1;
    const ordering = req.query.ordering || 'popular';
    const regex = new RegExp(escapeRegex(searchQuery), 'gi');
    let query = {$or: [{title: regex}, {contentLong: regex}, {contentShort: regex}]}
    if (day) {
        query['day'] = day
    }
    if (month) {
        query['month'] = month
    }
    if (year) {
        query['year'] = year
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
            $lookup: {from: 'File', localField: 'photo', foreignField: '_id', as: 'photo'}
        },
        {
            $lookup: {
                from: 'User',
                localField: 'user',
                foreignField: '_id',
                as: 'user'
            }
        },
        {$unwind:"$user"},
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
        {
            $project: {'user.hash': 0, 'user.salt': 0, 'user.email': 0}
        },
    ]
    if (req.query.user) {
        query['user.username'] = req.query.user
    }
    if (req.query.taxonomy) {
        query['taxonomies'] = {$all: [ObjectId(req.query.taxonomy)]}
    }
    if (req.query.action) {
        query['votes'] = {$elemMatch: {value: Number.parseInt(req.query.action)}}
    }
    aggregate.push({
        $lookup: {from: 'taxonomies', localField: 'taxonomies', foreignField: '_id', as: 'taxonomies'}
    })
    if (ordering === 'newest') {
        aggregate.push({$sort: {createdAt: -1}})
    } else {
        aggregate.push({$sort: {score: -1}})
    }
    try {
        const results = await FactModel.aggregate(aggregate)
        const display = await FactModel.aggregate(aggregate)
            .skip((pageSize * page) - pageSize)
            .limit(pageSize)
        res.json({
            results: display,
            currentPage: page,
            numPage: Math.ceil(results.length / pageSize),
            total: results.length
        });
    } catch (err) {
        return next(err)
    }
};

exports.retrieve = async (req, res, next) => {
    let user = await UserModel.findById(req.payload ? req.payload.id : null).catch(next);
    let out = req.instance.toJSONFor(user)
    out.taxonomies = req.taxonomies
    return res.json(out)
};

exports.vote = async (req, res, next) => {
    let user = await UserModel.findById(req.payload.id).catch(next)
    if (user) {
        user.vote(req.instance, req.body.value)
    }
    return res.json(user.isVoted(req.instance))
};

exports.update = (req, res) => {
    let data = getBody(req, ['title', 'contentLong', 'contentShort', 'date', 'photo', 'source', 'taxonomies']);
    for (let field of Object.keys(data)) {
        if (typeof data[field] !== 'undefined') {
            if (field === 'source') {
                if (data[field] && data[field].title) {
                    req.instance[field] = data[field];
                } else {
                    req.instance[field] = null
                }
            } else {
                req.instance[field] = data[field];
            }
        }
    }
    req.instance.save().then(function (instance) {
        return res.json(instance);
    }).catch(error => {
        let message = error && error.message ? error.message : 'Error';
        return responseError(res, message, {messageCode: 'error_get_all_user'});
    });
};

exports.delete = (req, res) => {
    return req.instance.remove().then(function () {
        return res.sendStatus(204);
    });
};

exports.comment = async (req, res, next) => {
    let user = await UserModel.findById(req.payload ? req.payload.id : null).catch(next);
    req.instance.comments.unshift({
        user: user._id,
        content: req.body.content,
        createdAt: new Date()
    })
    await req.instance.save()
    return res.json(req.instance.comments[0])
};
