const express = require('express');
const router = express.Router();
const taskCtrl = require('../controllers/factCtrl');
const {FactModel} = require('core-model');
const auth = require('./auth');

router.param('fact', async function (req, res, next, id) {
    let instance = await FactModel.findById(id)
        .populate({
            path: 'taxonomies',
            populate: {
                path: 'facts', populate: {path: 'photo', model: 'File'}
            }
        })
        .populate({
            path: 'comments.user'
        })
        .populate('user')
        .populate('photo').catch(next);
    if (!instance) {
        return res.sendStatus(404);
    }
    req.taxonomies = instance.taxonomies.map(x => x.toJsonFor())
    req.instance = instance;
    return next();
});

/* GET home page. */
router.get('/', auth.optional, taskCtrl.list);
router.post('/', auth.required, taskCtrl.create);
router.get('/random', auth.optional, taskCtrl.random);
router.get('/:fact', auth.optional, taskCtrl.retrieve);
router.put('/:fact', auth.optional, taskCtrl.update);
router.delete('/:fact', auth.required, taskCtrl.delete);
router.post('/:fact/vote', auth.required, taskCtrl.vote);
router.post('/:fact/comment', auth.required, taskCtrl.comment);

module.exports = router;
