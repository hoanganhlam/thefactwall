const {UserModel} = require('core-model');
const {responseJSON, responseError} = require('./response');
const {getBody, getParam} = require('./request');
var passport = require('passport');

exports.list = (req, res) => {
    return UserModel.find({})
        .then(users => {
            return responseJSON(res, 'Get all user successfully', users);
        })
        .catch(error => {
            let message = error && error.message ? error.message : 'Error when get all users';
            return responseError(res, message, {messageCode: 'error_get_all_user'});
        });
};

exports.create = (req, res) => {
    let data = getBody(req, ['bio','username', 'password', 'firstName', 'lastName', 'email', 'avatar']);
    return UserModel.findOne({username: data.username})
        .then(user => {
            if (user) {
                return responseError(res, 'User has been existed', {messageCode: 'user_existed'}, 405);
            } else {
                let newUser = new UserModel()
                newUser.username = data.username;
                newUser.name = data.name;
                newUser.email = data.email;
                newUser.setPassword(data.password);
                newUser.save()
            }
        })
        .then(created => {
            return responseJSON(res, 'Create user successfully', created);
        })
        .catch(error => {
            let message = error && error.message ? error.message : 'Error when create user';
            return responseError(res, message, {messageCode: 'error_create_user'});
        });
};

exports.retrieve = (req, res) => {
    return res.json(req.instance)
};

exports.update = (req, res) => {
    let data = getBody(req, ['firstName', 'lastName', 'avatar', 'bio']);
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

exports.me = (req, res, next) => {
    UserModel.findById(req.payload.id)
        .populate({path: 'avatar', model: 'File'})
        .then(function (user) {
        if (!user) {
            return res.sendStatus(401);
        }
        return res.json(user);
    }).catch(next);
};

exports.login = (req, res, next) => {
    let data = getBody(req, ['email', 'password']);
    if (!data.email) {
        return res.status(422).json({errors: {email: "can't be blank"}});
    }

    if (!data.password) {
        return res.status(422).json({errors: {password: "can't be blank"}});
    }
    passport.authenticate('local', {session: false}, function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (user) {
            user.token = user.generateJWT();
            return res.json(user.toAuthJSON());
        } else {
            return res.status(422).json(info);
        }
    })(req, res, next);
}
