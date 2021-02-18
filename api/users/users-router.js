const router = require("express").Router();
const Users = require("./users-model");
const restricted = require("../auth/restricted-middleware");

router.get('/', restricted, (req, res) => {
    Users.getUsers()
        .then((users) => {
            res.status(200).json(users)
        })
        .catch(err => {
            res.status(500).json({ message: "Server failed to get users", error: err })
        });
});

module.exports = router;