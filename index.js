const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const fs = require('fs');
const io = require('socket.io')(server);


let pool = [null,null, null,null,null]


app.use(express.static('src'));

app.get('/', function(req, res){
  fs.readFile('./src/index.html', (err, data) => {
    if(err) throw err;
    res.writeHead(200, {
      'Content-Type' : 'text/html'
    })
    .write(data)
    .end();
  });
});

io.sockets.on('connection', function(socket){
  socket.on('newUserConnect', function(name){
    socket.name = name;

    if(pool[0] == null&&pool.length>=0){
        pool[0] = name
    }else if(pool[1]==null&&pool.length>=0){
      pool[1] = name
    }else if(pool[2]==null&&pool.length>=0){
      pool[2] = name
    }else if(pool[3]==null&&pool.length>=0){
      pool[3] = name
    }else if(pool[4]==null&&pool.length>= 0){
      pool[4] = name
    }
    //visitor += 1;
    //pool[visitor] = name;
    io.sockets.emit('updateMessage', {
      name : 'SERVER',
      message : name + '님이 접속했습니다.'
    });
    io.sockets.emit('updateMessage',{
      name : 'ATTENDANCENAME',
      message : pool
    });
  });
  socket.on('disconnect', function(){
    io.sockets.emit('updateMessage', {
      name : 'DISSERVER',
      message : socket.name
    });

  });
  socket.on('sendMessage', function(data){
    data.name = socket.name;
    io.sockets.emit('updateMessage', data);
  });
  socket.on('sendMessageCHAT', function(data){
    data.name = socket.name;
    io.sockets.emit('updateMessageCHAT', data);
  });
  socket.on('sendAnswer', function(data){
    data.name = socket.name;
    io.sockets.emit('updateanswer', data);
  });
  socket.on('updateattend', function(data){
    pool = data.arr;

  });
});

server.listen(8080, function(){
  console.log('서버 실행중...');
});
