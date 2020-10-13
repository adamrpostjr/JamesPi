const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const ejs = require('ejs');
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.set('view-engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public/'));
app.use(bodyParser.json());

app.get('/', (req, res, next)=>{
  res.render(__dirname + '/public/index.ejs')
})

server.listen(8085, ()=>{console.log('listening on 8085');})

