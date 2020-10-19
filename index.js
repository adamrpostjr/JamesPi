const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const ejs = require('ejs');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const store = require('nedb');
const insults = new store({ filename: 'insults.db', autoload: true })


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
    if (data.password == "techPass") {
      var update = data.update
      if (data.store == 1) {
        insults.insert({uuid: client.id, insults: update})
      }        
      io.emit('updateClient', update)
    }
  })
  client.on('help', function(data){
    console.log(client.id);
    // io.broadcast.to(client.id).emit('helper','coming soon');
  })
  
  
  
  
  
  
  
  client.on('disconnect', function(){
    console.log('user '+ client.id+ ' disconnected');
  })
})







server.listen(8090, ()=>{
  console.log('listening on 8090');
})