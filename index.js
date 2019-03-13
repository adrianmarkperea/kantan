const path = require('path');

const express = require('express');
const app = express();

const port = 8080;

app.use(express.static(path.join(__dirname, 'public')));

app.listen(process.env.PORT || port, () => {
  console.log(`App listening on port ${port}`);
});
