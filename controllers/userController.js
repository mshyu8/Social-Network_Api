const { User, Thought } = require('../models');

module.exports = {
    getUsers(req, res) {
        User.find()
            .then(async (users) => {
                const userObj = { users };
                return res.json(userObj);
            })
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
            });
    },
    getSingleUser(req, res) {
        User.findOne({ _id: req.params.userId })
            .select('-__V')
                .then(async (user) => 
                !user
                ? res.status(404).json({ message: 'No user with that ID'})
                : res.json({ user })
                )
                .catch((err) => {
                    console.log(err);
                    return res.status(500).json(err);
                });
    },

    createUser(req, res) {
        User.create(req.body)
            .then((user) => res.json(user))
            .catch((err) => res.status(500).json(err));
    },

    updateUser(req, res) {
        User.findOneAndUpdate(
            {_id: req.params.userId },
            { $set: req.body },
            {runValidators: true, new: true}
        )
        .then((user) => 
        !user 
        ? res.status(404).json({ message: 'No user with this id' })
        : res.json(user)
        )
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    },
    deleteUser(req, res) {
        User.findOneAndRemove({ _id: req.params.userId })
        .then((user) => 
        !user
            ? res.status(404).json({ message: 'No such user exists' })
            : Thought.deleteMany({_id: {$in: user.thoughts} })
        )
        .then(() => res.json({ message: 'User and thoughts successfully deleted'}))
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    },
    addFriend(req, res) {
        console.log('You are adding a friend');
        console.log(req, body);
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $addToSet: { friends: req.params.friendId } },
            { runValidators: true, new: true }
        )
        .then ((user) => 
        User.findOneAndUpdate(
            { _id: req.params.friendId},
            { $addToSet: { friends: req.params.userId} },
            { runValidators: true, new: true }
        )
        )
        .then((user) => 
        !user
            ? res
                .status(404)
                .json({ message: 'No user found with that ID'} )
            : res.json(user)
        )
        .catch((err) => res.status(500).json(err))
    },
    removeFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: {friends: req.params.friendsId} },
            { runValidators: true, new: true}
        )
        .then (() => 
        User.findOneAndUpdate(
            { _id: req.params.friendId },
            { $pull: {friends: req.params.userId} },
            { runValidators: true, new: true }
        )
        )
        .then((user) => 
        !user
            ? res
                .status(404)
                .json({message: 'No user found with that ID'} )
                : res.json(user)
        )
        .catch((err) => res.status(500).json(err));
    },
};