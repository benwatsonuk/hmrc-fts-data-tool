const app = require('express')();

app.get('/', (req, res) => {       
    res.send('API time!')
 })

app.post('/get-info-from-domain', (req, res) => {
    const domain = req.body.domain || req.query.domain
    if (!domain) {
        return res.status(400).json({error: 'Domain is required'})
    }
    // Simulate fetching data based on the domain
    const data = {
        domain,
        info: `Information about ${domain}`,
        timestamp: new Date()
    }
    res.json(data)
})

module.exports = app;