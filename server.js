const express = require('express');
const cors = require('cors')
const router = require('./routes');

const {PORT} = require('./config');

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static('public'));

app.use('/', router);

app.listen(PORT, () => {
  console.log(`app is listening on port: ${PORT}`);
})
