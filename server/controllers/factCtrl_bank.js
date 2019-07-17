const {FactModel, UserModel, TaxonomyModel} = require('core-model');
const {responseError} = require('./response');
const {getBody} = require('./request');

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

    let instance = new FactModel(data)
    instance.user = user
    if (data.taxSlugs.length) {
        let taxonomies = await TaxonomyModel.find({'slug': {$in: data.taxSlugs}})
        instance.taxonomies = taxonomies.map(x => x._id)
    }
    try {
        let test = await FactModel.find({contentShort: data.contentShort});
        if (test.length) {
            return res.json(test[0]);
        }
        await instance.save()
        return res.json(instance)
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
    const taxonomy = req.query.taxonomy || null;
    const searchQuery = req.query.search || ''
    const page = req.query.page || 1;
    const regex = new RegExp(escapeRegex(searchQuery), 'gi');
    let query = {$or: [{title: regex}, {contentLong: regex}, {contentShort: regex}]}
    if (day) {

    }
    if (month) {

    }
    if (year) {

    }
    if (taxonomy) {
        query['taxonomies'] = taxonomy
    }
    try {
        const results = await FactModel.find(query)
        const display = await FactModel.find(query)
            .populate('user')
            .populate('taxonomies')
            .populate('photo')
            .skip((pageSize * page) - pageSize)
            .limit(pageSize)
            .exec();
        res.json({
            results: display.map((x) => {
                return x.toJSONFor(user)
            }),
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
    let data = getBody(req, ['title', 'contentLong', 'contentShort', 'date', 'photo']);
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
