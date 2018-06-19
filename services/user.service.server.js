module.exports = function (app) {
    app.get('/api/user', findAllUsers);
    app.get('/api/user/:userId', findUserById);
    app.post('/api/user', createUser);
    app.get('/api/profile', profile);
    app.put('/api/profile', updateProfile);
    app.post('/api/logout', logout);
    app.post('/api/login', login);
    app.get('/api/login',isLoggedIn);
    app.get('/api/login/isAdmin',isAdmin);
    var userModel = require('../models/user/user.model.server');

    function isAdmin(req,res){
        if(req.session['currentUser']===undefined){
            res.sendStatus(501);
        }
        else{
            const id = req.session['currentUser']._id;
            userModel.findUserById(id)
                .then(
                    response =>{
                        if(response.type==='Admin'){
                            res.sendStatus(200);
                        }
                        else{
                            res.sendStatus(500);
                        }
                    }
                );}
    }
    function isLoggedIn(req,res) {
        if(req.session['currentUser']===undefined){
            res.sendStatus(500);
        }
        else{
            res.sendStatus(200);
        }
    }
    function updateProfile(req,res){
        var user = req.body;
        userModel.findUserById(req.session['currentUser']._id).then(response =>{
            console.log(response);
            if(response.username===user.username){
                console.log("in if of username and id match just update")
                userModel.updateUser(req.session['currentUser']._id,user)
                    .then(response=>
                            res.sendStatus(200)
                    );
            }
            else{
                userModel.findByUserName(user.username).then(response=>
                {
                    if(response===null)
                    {
                        userModel.updateUser(req.session['currentUser']._id,user)
                            .then(response=>
                                    res.sendStatus(500)
                            );
                    }
                    else{
                        res.sendStatus(500);
                    }})
            }
        })
    }
    function login(req, res) {
        var credentials = req.body;

        userModel
            .findUserByCredentials(credentials)
            .then(function(user) {
                if(user===null){
                    res.status(500).send({ error: "Invalid credentials" });
                }
                else{
                    req.session['currentUser'] = user;
                    req.session['userId'] = user._id;
                    res.json(user);}
            })
    }

    function logout(req, res) {
        req.session.destroy();
        res.sendStatus(200);
    }

    function findUserById(req, res) {
        var id = req.params['userId'];
        userModel.findUserById(id)
            .then(function (user) {
                res.json(user);
            })
    }

    function profile(req, res) {
        // userModel.findUserByUsername(req.session['currentUser']);
        userModel.findUserById(req.session['currentUser']._id)
            .then(response=> res.send(response));
        // res.send(req.session['currentUser']);
        // console.log(req.session['currentUser']);
    }

    function createUser(req, res) {
        var user = req.body;
        userModel.findByUserName(user.username).then(
            response =>{
                if(response===null){
                    userModel.createUser(user)
                        .then(function (user) {
                            req.session['currentUser'] = user;
                            res.send(user);
                        })
                }
                else
                {
                    res.sendStatus(500);
                }
            }
        )

    }

    function findAllUsers(req, res) {
        userModel.findAllUsers()
            .then(function (users) {
                res.send(users);
            })
    }
}
