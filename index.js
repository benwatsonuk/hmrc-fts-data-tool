const express = require('express')
const app = express()
// const session = require('express-session')
const bodyParser = require('body-parser')
const nunjucks = require('nunjucks')
// const path = require("path");
// const fs = require("fs");
// const validator = require('jsonschema').Validator;
// const fileUpload = require('express-fileupload');

// const {JsonViewer} = require('@alenaksu/json-viewer')

const apiRoutes = require('./routes/api.js')

nunjucks.configure(['views', "node_modules/govuk-frontend/", "node_modules/hmrc-frontend/"], {
  autoescape: true,
  express: app
})

app.set('view engine', 'html')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))
// parse application/json
app.use(bodyParser.json())
// app.use(fileUpload());
// app.use(session({secret: 'fts', cookie: {maxAge: 600000}}))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/api', apiRoutes)

app.listen(5005, () => console.log('FTS Data Tool is listening on port 5005.'))
