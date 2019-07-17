const {TaxonomyModel, UserModel, FactModel} = require('core-model');
const {responseError} = require('./response');
const {getBody} = require('./request');
const slug = require('slug');
const mongoose = require('mongoose')

const escapeRegex = (string) => {
    return string.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

exports.create = async (req, res, next) => {
    let user = await UserModel.findById(req.payload.id).catch(next);
    if (!user) {
        return res.sendStatus(401);
    }
    let data = getBody(req, ['title', 'description', 'isPublic', 'isObject', 'slug', 'photos']);
    try {
        let test = await TaxonomyModel.find({slug: data.slug});
        if (test.length) {
            return res.json(test[0]);
        }
        let instance = new TaxonomyModel(data)
        await instance.save()
        return res.json(instance);
    } catch (error) {
        let message = error && error.message ? error.message : 'Error';
        return responseError(res, message, {messageCode: 'error_get_user'});
    }
};

exports.list = async (req, res, next) => {
    const pageSize = Number.parseInt(req.query.pageSize) || 10;
    const page = Number.parseInt(req.query.page) || 1;
    try {
        const searchQuery = req.query.search || ''
        const regex = new RegExp(escapeRegex(searchQuery), 'gi');
        const results = await TaxonomyModel.find({title: regex})
            .skip((pageSize * page) - pageSize)
            .limit(pageSize);
        const total = await TaxonomyModel.count();
        res.json({
            results: results,
            currentPage: page,
            numPage: Math.ceil(total / pageSize),
            total: total
        });
    } catch (err) {
        return next(err)
    }
};

exports.retrieve = async (req, res, next) => {
    let user = await UserModel.findById(req.payload ? req.payload.id : null).catch(next);
    const pageSize = req.query.pageSize || 10
    let fact = {
        results: [],
        currentPage: 1,
        total: 0
    }
    FactModel.find({taxonomies: {$all: req.instance}}).populate('user').populate('photo').then(all => {
        fact.total = all.length
        const contributors = [];
        const map = new Map();
        for (const item of all) {
            if (!map.has(item.user._id)) {
                map.set(item.user._id, true);
                contributors.push(item.user);
            }
        }
        FactModel
            .find({taxonomies: {$all: req.instance}}).populate('user').populate('taxonomies').populate('photo')
            .skip((pageSize * 1) - pageSize)
            .limit(pageSize).then(results => {
            fact.results = results.map((x) => {
                return x.toJSONFor(user)
            })
            return res.json({
                instance: req.instance[0].toJsonFor(),
                fact,
                contributors
            });
        })
    })
};

exports.update = (req, res) => {
    let data = getBody(req, ['title', 'description', 'isPublic', 'isObject', 'photos']);
    for (let field of Object.keys(data)) {
        if (typeof data[field] !== 'undefined') {
            req.instance[field] = data[field];
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

exports.run = (req, res) => {
    return res.sendStatus(204);
};
