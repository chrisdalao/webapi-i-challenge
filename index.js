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
            res.status(500).json(err)
        })
})

server.post('/users', (req, res) => {
    const userData = req.body;

    Users.insert(userData)
        .then(user => {
            if (user) {
                res.status(201).json(user)
            } else {
                res.status(400).json({ message: "PLease provide name and bio for the user." });
            }
        })
        .catch(err => {
            res.status(500).json(err)
        })
})

server.delete('/users/:id', (req, res) => {
    const { id } = req.params;

    Users.remove(id)
        .then(deleted => {
            if (deleted) {
                res.status(204).end();
            } else {
                res.status(404).json({ message: "Cannot find that user" })
            }
        })
        .catch(err => {
            res.status(500).json(err)
        })
})

server.get('/users/:id', (req, res) => {
    const { id } = req.params;

    Users.findById(id)
        .then(user => {
            res.status(200).json(user)
        })
        .catch(err => {
            res.status(500).json(err)
        })
})

server.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const changes = req.body;

    Users.update(id, changes)
        .then(updated => {
            if (updated) {
                res.status(200).json(updated);
            } else {
                res.status(404).json({ message: "cannot find that user" });
            }
        })
        .catch(error => {
            res.status(500).json(error)
        })
})

const port = 9090;
server.listen(port, () => console.log(`running on port ${port}`));