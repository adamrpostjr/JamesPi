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
});
app.get('/favicon.ico', (req, res, next)=>{
  return "coming soon";
});

io.on('connection', function(client) {
  console.log('user '+ client.id+' connected')
  io.emit('testing', 'testing')
  
  
  
  client.on('update', function(data){
    console.log(data);
    if (data.password == "techPass") {
      var update = data.update
      io.emit('updateClient', update)
    }
  })
  
  
  
  
  
  
  
  
  
  
  client.on('disconnect', function(){
    console.log('user '+ client.id+ ' disconnected');
  })
})







server.listen(8090, ()=>{
  console.log('listening on 8090');
})