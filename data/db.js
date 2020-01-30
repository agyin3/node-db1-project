const db = require('./dbConfig.js')

module.exports = {
    find,
    findById,
    insert, 
    update,
    remove
}

function find({limit, sortby, sortdir}){
    return db('accounts')
        .limit(limit ? limit : 100)
        .orderBy(sortby ? sortby : 'id', sortdir ? sortdir : 'asc')
}

function findById(id){
    return db('accounts')
        .where({id: Number(id)})
        .then(res => res[0])
}

function insert(body){
    return db('accounts')
        .insert(body)
        .then(id => {
            return findById(id[0])
        })
}

function update(id, changes){
    return db('accounts')
        .where({id})
        .update(changes)
        .then(() => {
            return findById(id)
        })
}

function remove(id){
    return db('accounts')
        .where({id})
        .del()
}

