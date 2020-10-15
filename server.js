const app = require("./app");
const express = require('express');
const http = require("http");
const config = require("./utils/config");
const path = require('path');

let a = 1;
let b = 2;

const server = http.createServer(app);

if(process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  app.get('*', (req,res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  })
}

server.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});
