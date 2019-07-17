const express = require('express');
const cors = require('cors')
const router = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static('public'));

app.use('/', router);

app.listen(8080, () => {
  console.log('app is listening on port 8080');
})
