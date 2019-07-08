const express = require('express');
const Users = require('./data/db.js');
const server = express();

server.use(express.json());

server.get('/users', (req, res) => {
    Users.find()
        .then(users => {
            res.status(200).json(users)
        })
        .catch(err => {
            err = { error: "The users information could not be retrieved." };
            res.status(500).json(err);
        })
})

server.get('/users/:id', (req, res) => {
    const { id } = req.params;
    Users.findById(id)
        .then(user => {
            if (user) {
                res.status(200).json(user)
            } else {
                res.status(404).json({ message: "The user with the specified ID does not exist." });
            }
        })
        .catch(err => {
            err = { error: "The user information could not be retrieved." };
            res.status(500).json(err)
        })
})

server.post('/users', (req, res) => {
    const userData = req.body;
    if (!userData.name || !userData.bio) {
        res.status(400).json({ errorMessage: "Please provide name and bio for the user." });
    } else {
        Users.insert(userData)
            .then(user => {
                if (user) {
                    res.status(201).json(userData)
                }
            })
            .catch(err => {
                err = { error: "There was an error while saving the user to the database" };
                res.status(500).json(err)
            })
    }
})

server.delete('/users/:id', (req, res) => {
    const { id } = req.params;

    Users.remove(id)
        .then(deleted => {
            if (deleted) {
                res.status(204).end();
            } else {
                res.status(404).json({ message: "The user with the specified ID does not exist." })
            }
        })
        .catch(err => {
            err = { error: "The user could not be removed." };
            res.status(500).json(err)
        })
})


server.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const changes = req.body;

    Users.update(id, changes)
        .then(updated => {
            if (!updated) {
                res.status(404).json({ message: "The user with the specified ID does not exist." });
            } else if (!changes.name || !changes.bio) {
                res.status(400).json({ errorMessage: "Please provide name and bio for the user." });
            }
            else {
                res.status(200).json(changes);
            }
        })
        .catch(error => {
            err = { error: "Please provide name and bio for the user." };
            res.status(500).json(error)
        })
})


const port = 9090;
server.listen(port, () => console.log(`running on port ${port}`));