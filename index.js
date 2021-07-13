const express = require('express')
const cors = require('cors')
const fs = require('fs')
const app = express()
const port = 3000

const msgs = require('./datas.js')

let messages = JSON.parse(fs.readFileSync('nddatas.json'))
let lastId = fs.readFileSync('id.txt')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.options('*', cors())

/**
 * returns all messages
 */
app.get('/messages', (req, res) => {
    res.send(messages);
})

/**
 * Add a new message to messages (=list in DB)
 */
app.post('/messages', (req, res) => {
    lastId++;
    fs.writeFileSync('id.txt', `${lastId}`)
    let obj = req.body
    obj.id = lastId
    messages.push(obj)
    fs.writeFileSync('nddatas.json', JSON.stringify(messages))
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.send({ resp: 'it\'s all good, doll !' })
})

/**
 * met à jour la propriété read d'un message dont l'id est passé dans l'url
 */
app.put('/messages/:id/read', (req, res) => {
    let status = 0
    messages.map(m => {
        if (m.id == req.params.id && m.read === false) {
            m.read = true
            status = 200
        } else {
            status = 304
        }
        return m
    })
    status === 200 && fs.writeFileSync('nddatas.json', JSON.stringify(messages))
    res.status(status).send('update done !')
})

/**
 * Deletes message by id
 */
app.delete('/messages/:id', (req, res) => {
    let status = 0
    let temp = messages.filter(m => m.id != req.params.id)
    temp.length === messages.length ? status = 304 : status = 200
    status === 200 && fs.writeFileSync('nddatas.json', JSON.stringify(temp))
    res.status(status).send('deleted')
})


// ###########################################################################
app.get('/test', (req, res) => {
    res.send('Hello World!')
})

app.get('/getMessages', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')

    res.send(msgs);
})

app.post('/create-message', (req, res) => {
    // Adding to DB
    console.log(req.body);
    res.send(req.body)
})

app.get('/getLastId', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    let lastId = msgs.length
    res.send(`${lastId}`)
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})