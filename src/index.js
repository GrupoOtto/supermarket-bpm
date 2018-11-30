const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const api = require('./api');
const loggin = require('./utils/loggin');

const port = process.env.PORT || 3000

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(morgan('tiny'));
app.use(loggin.timeLoggin())

api(app);

app.use((err, req, res, next) => {
  res.status(err.status || 500).json(err);
  throw err;
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
