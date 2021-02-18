const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secrets = require('../config/secrets');
const Users = require('../users/users-model');
const router = require("express").Router();

router.post('/register', (req, res) => {
    if (!req.body.username || !req.body.password || !req.body.department) {
        res.status(400).json({ message: "Please provide username, password, and department" })
    } else {
        //hash the password
        const hash = bcryptjs.hashSync(req.body.password, 10);
        req.body.password = hash;

        // save the user to the database
        Users.add(req.body)
            .then(user => {
                res.status(201).json(user);
            })
            .catch(err => {
                res.status(500).json({ message: "Server failed to register user", error: err })
            })
    }
});

router.post('/login', (req, res) => {
    if (!req.body.username || !req.body.password) {
        res.status(400).json({ message: "Please provide username and password" })
    } else {
        Users.findBy({ username: req.body.username })
        .then(([user]) => {
            // compare the password the hash stored in the database
            if (user && bcryptjs.compareSync(req.body.password, user.password)) {
                const token = generateToken(user);
                res.status(200).json({ message: `Welcome ${user.username}`, token });
            } else {
                res.status(401).json({ message: "Invalid credentials" });
            }
        })
        .catch(err => {
            res.status(500).json({ message: "Server failed to login user" })
        })
    }
});

function generateToken(user) {
    const payload = {
        subject: user.id,
        username: user.username,
        department: user.department
    };

    const options = {
        expiresIn: "1h"
    };

    return jwt.sign(payload, secrets.jwtSecret, options)
}

module.exports = router;