const express = require('express');

const db = require('./data/db.js');

const server = express();

server.use(express.json());

server.get('/api/accounts', (req, res) => {
    db.find(req.body)
        .then(accounts => {
            res.status(200).json(accounts)
        })
        .catch(err => {
            res.status(500).json({errorMessage: `There was an error with your ${req.method} request`})
        })
})

server.get('/api/accounts/:id', validateById, (req,res) => {
    res.status(200).json(req.account)
})

server.post('/api/accounts', (req,res) => {
    if (req.body.name && req.body.budget){
        db.insert(req.body)
            .then(account => {
                res.status(201).json({message: 'Account successfully added', account})
            })
            .catch(err => {
                res.status(500).json({errorMessage: `There was an error with your ${req.method} request`})
            })
    }else{
        res.status(404).json({message: 'Both a name and budget field are required'})
    }
})

server.put('/api/accounts/:id', validateAccount, validateById, async (req,res) => {
    const accountInfo = {...req.body, id: req.account.id}
    try {
        const account = await db.update(req.account.id, accountInfo)
        res.status(201).json({message: 'Account successfully updated', account})
    }catch(err) {
        res.status(500).json({errorMessage: `There was an error with your ${req.method} request`})
    }
})

server.delete('/api/accounts/:id', validateById, (req, res) => {
    db.remove(req.account.id)
        .then(() => {
            res.status(201).json({message: 'Account successfully deleted', account: req.account})
        })
})

function validateAccount(req, res, next) {
    if(req.body.name && req.body.budget){
        next()
    }else{
        res.status(404).json({message: 'Both a name and budget field are required'})
    }
}

async function validateById (req, res, next) {
    const {id} = req.params
    try {
        const account = await db.findById(id)
        if(!account){
            res.status(404).json({message: 'No account with that id was found'})
        }else{
            req.account = account
            next()
        }
    }catch(err){
        res.status(500).json({errorMessage: `There was an error with your ${req.method} request`})
    }
}

module.exports = server;