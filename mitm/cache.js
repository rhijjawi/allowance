const express = require('express');
const axios = require('axios');
const api_key = "0840e9bbd1387e39f3605ac4684c9395"
const app = express();
const fsp = require('fs/promises');
const fs = require('fs');
let historicalCache = {}
let todayCache = {}

app.use((req, res, next) => {
    console.log(req.get('origin'))
    console.log(req.get('referer'))
    process.env.NODE_ENV=='development' ? res.header('Access-Control-Allow-Origin', 'http://expenses.ramzihijjawi.me:3000') : res.header('Access-Control-Allow-Origin', 'https://logmoney.app');
    res.header('Cross-Origin-Resource-Policy', 'same-origin') ;
    next();
})
app.get('/health', (req, res) => {
    res.json({status: 'ok'}).status(200)
})
app.get('/today/:src/:dst', async(req, res) => {
    const { src } = (req.params) //EUR
    const { dst } = (req.params) //USD
    let fromCache = false
    if (src in todayCache) {
        fromCache = true
    }
    else {
        let exch = await axios.get(`http://api.exchangeratesapi.io/v1/latest?access_key=${api_key}&base=${src}`)
        todayCache[src] = exch.data.rates
    }
    res.set('fromcache', 'true').json({ "checkstr": `One ${src} = ${todayCache[src][dst]}`,amount: todayCache[src][dst], fromCache: fromCache});
    console.log(todayCache)
    //write object changes to file
    fs.writeFile('todayCache.json', JSON.stringify(todayCache), (err) => {
        if (err) {
            console.log(err)
        }
        else {
            console.log('Successfully wrote to file')
        }
    })
})

app.get('/historical/:date/:src/:dst', async(req, res) => {
    const { src } = (req.params) //EUR
    const { dst } = (req.params) //USD
    const { date } = (req.params) //YYYY-MM-DD
    
    if (historicalCache[date] == undefined) {
        historicalCache[date] = {}
    }
    if (src in historicalCache[date]) {
        console.log('Cache hit for historical')
        return res.json({amount : historicalCache[date][src][dst], fromCache: true})
    }
    else {
        console.log('Cache miss for historical')
        console.log(`http://api.exchangeratesapi.io/v1/${date}?access_key=${api_key}&base=${src}`)
        let exch = await axios.get(`http://api.exchangeratesapi.io/v1/${date}?access_key=${api_key}&base=${src}`)
        historicalCache[date][src] = exch.data.rates
    }
    rate = historicalCache[date][src][dst]
    res.set('fromcache', 'true').json({ "checkstr": `One ${src} = ${historicalCache[date][src][dst]}`, amount : historicalCache[date][src][dst] , fromCache: false})
    //write object changes to file
    console.log(historicalCache)
    fs.writeFile('historicalCache.json', JSON.stringify(todayCache), (err) => {
        if (err) {
            console.log(err)
        }
        else {
            console.log('Successfully wrote to file')
        }
    })
})


app.listen(3001, () => {
    console.log('Listening on port 3001')
})