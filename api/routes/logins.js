const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/register');

router.get('/', (req, res, next) => {
    User.find()
    .select('email firstname lastname')
    .exec()
    .then(docs => {
        res.status(200).json(docs);
    }).catch(err => {
        console.log(err);
    });
});

router.post('/', (req, res, next) => {
    User.find({ email: req.body.email })
    .exec()
    .then( user => {
        if (user.length < 1){
            return res.status(401).json({
                message: 'Auth Failed Ja'
            });
        }
        if ( user ) {
            return res.status(200).json({
                message: 'Login Complete',
                email: user.email,
            })
        } else {
            return res.status(401).json({
                message: 'Login Falied'
            })
        }
    }).catch( err => {
        console.log(err);
        return res.status(500).json({
            message: 'Login Falied'
        });
    });
});

// router.post('/login', (req, res, next) => {
//     User.find({ email: req.body.email })
// x    .exec()
//     .then(user => {
//         console.log(user);
//         if (user.length < 1) {
//             return res.status(401).json({
//                 message: 'Auth Failed Ja'
//             });
//         }   
//         bcrypt.compare(req.body.password, user[0].password, (err, result) => {
//             if (err) {
//                 return res.status(401).json({
//                     message: 'Auth Failed'
//                 });
//             }
//             console.log(result);
//             if (result) {
//                 const token = jwt.sign({
//                     email:  user[0].email,
//                     userId: user[0]._Id 
//                 }, process.env.JWT_KEY,
//                 {
//                     expiresIn: "1h "
//                 }
//             )
//                 return res.status(200).json({
//                     message: 'Auth Succesful',
//                     token: token
//                 })
//             } else {
//                 return res.status(401).json({
//                     message: 'Auth Failed'
//                 });
//             }
//         });
//     })
// })

router.post('/', (req, res, next) => {
    const userId = new User ({
        _id: new mongoose.Types.ObjectId(),  
        firstname: req.body.firstName,
        lastname: req.body.lastName,
        email: req.body.email,
        password: req.body.password 
    });
    userId.save().then(result => {
        res.status(201).json({
            message: 'Register Complete',
            registerForm: {
                email: result.email,
                firstname: result.firstname,
                lastname: result.lastname,
                password: result.password,
                _id: result._id,
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/register/' + result.id
                }
            }
        })
    })
    .catch(err => { 
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.get('/:userId', (req, res, next) => {
    const id = req.params.userId
    User.findById(id)
    .select('email firstname lastname')
    .exec()
    .then(doc => {
        console.log( doc);
        res.status(200).json({
            userInfo: doc,
            request: {
                type: 'GET',
                url: 'http://localhost:3000/register'
            }
        }); 
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.delete('/:userId', (req, res, next) => {
    const id = req.param.userId
    User.remove({id : id})
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({message: err});
        
    })
});

router.patch('/:userId,', (req, res ,next) => {
    const id = req.params.userId; 
    const updateOps = [];
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value; 
    }
    User.update({_id: id}, { $set: updateOps }).exec()
    .then(result => {
        console.log(result);
        res.status(200).json({
            message: 'Update Complete',
            request: {
                type: 'GET',
                url: 'https//localhost:3000/register'
            }
        });
    })
    .catch(err => {  
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}); 

module.exports = router;