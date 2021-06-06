'use strict';


var socket = io();
var chatWindow = document.getElementById('chatWindow');
var chatWindow2 = document.getElementById('chatWindow2');
var sendButton = document.getElementById('chatMessageSendBtn');
var sendButton2 = document.getElementById('chatMessageSendBtn2');
var chatInput = document.getElementById('chatInput');
var player1 = document.getElementById('player1');
var player2 = document.getElementById('player2');
var player3 = document.getElementById('player3');
var player4 = document.getElementById('player4');
var examiner = document.getElementById('examiner');
var answerinput = document.getElementById('answerinput');
var answerbutton = document.getElementById('answerbutton');
let answer = 'null';
let arr = [null,null,null,null,null]
var chatcount=0;
var answercount=0;

socket.on('connect', function(){
  var name = prompt('대화명을 입력해주세요.', '');
  socket.emit('newUserConnect', name);
});

socket.on('updateMessage', function(data){
  if(data.name === 'SERVER'){
    var info = document.getElementById('info');
    info.innerHTML = data.message;

    setTimeout(() => {
      info.innerText = '';
    }, 2000);
  }else if(data.name ==='DISSERVER'){
    var info = document.getElementById('info');
    info.innerHTML = data.message+'님이 퇴장하셨습니다.';
    setTimeout(() => {
      info.innerText = '';
    }, 2000);

    //alert(arr[1]);
    if(examiner.innerText == data.message){
      examiner.innerText = 'null';
      arr[0] = null
    }else if (player1.innerText == data.message) {
      player1.innerText = 'null';
      arr[1] = null
    }else if (player2.innerText == data.message) {
      player2.innerText = 'null';
      arr[2] = null
    }else if (player3.innerText == data.message) {
      player3.innerText = 'null';
      arr[3] = null
    }else if (data.message == player4.innerText) {
      player4.innerText = 'null';
      arr[4] = null
    }
    socket.emit('updateattend', {
      arr
    });
  }else if(data.name === 'ATTENDANCENAME'){

    arr = data.message;

    examiner.innerHTML = arr[0]
    player1.innerHTML = arr[1]
    player2.innerHTML = arr[2]
    player3.innerHTML = arr[3]
    player4.innerHTML = arr[4]

  }
  else{
    var chatMessageEl = drawAnswerMessage(data);
    chatWindow.appendChild(chatMessageEl)
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }
});

socket.on('updateMessageCHAT', function(data){
  var chatMessageEl = drawChatMessage(data);
  chatWindow2.appendChild(chatMessageEl)
  chatWindow2.scrollTop = chatWindow2.scrollHeight;
});
socket.on('updateanswer', function(data){
  answer = data.message
});

sendButton.addEventListener('click', function(){
  var message = chatInput.value;
  if(!message) return false;
  socket.emit('sendMessage', {
    message
  });
  chatInput.value = '';
});

sendButton2.addEventListener('click', function(){
  var message = chatInput2.value;
  if(!message) return false;
  socket.emit('sendMessageCHAT', {
    message
  });
  chatInput2.value = '';
});

answerbutton.addEventListener('click', function(){
  var message = answerinput.value;
  if(!message) return false;
  socket.emit('sendAnswer', {
    message
  });
  alert("정답이 입력이 되었습니다.");
});




function drawAnswerMessage(data){
  var wrap = document.createElement('p');
  var message = document.createElement('span');
  var name = document.createElement('span');


  if(data.message == answer ){
    name.innerText = data.name;
    message.innerText = '이 승리자였습니다. 새로운 게임을 진행해주세요.';
    alert(data.name +"님이 정답을 맞추어서 승리하셨습니다.\n 정답은 '" + data.message+"' 이였습니다.");
    chatWindow.innerText = '';
    chatWindow2.innerText = '';
  }else {
    name.innerText = data.name;
    message.innerText = data.message + '은(는) 정답이 아닙니다. \n 남은 정답 횟수:'+(19-answercount);
  }

  name.classList.add('output__user__name');
  message.classList.add('output__user__message');

  wrap.classList.add('output__user');
  wrap.dataset.id = socket.id;
  answercount=answercount+1;
  if(answercount>20){
    alert("정답 입력 횟수 초과로 인한 출제자 승리");
    name.innerText = examiner.innerText;
    message.innerText = "님이 정답 횟수 초과로 인해 승리하셨습니다.\n 새로운 게임을 진행해주세요. ";
    chatWindow.innerText = '';
    chatWindow2.innerText = '';
    answercount=0;
  }


  wrap.appendChild(name);
  wrap.appendChild(message);
  return wrap;
}
function drawChatMessage(data){
    var wrap = document.createElement('p');
    var message = document.createElement('span');
    var name = document.createElement('span');
    if(chatcount<20 && data.name != examiner.innerText){

    name.innerText = data.name;
    message.innerText = data.message+ "\n 남은 질문 횟수:" +(19-chatcount);
  }else if(data.name == examiner.innerText){
    name.innerText = data.name;
    message.innerText = data.message
    chatcount -=1;
  }else{
    name.innerText = examiner.innerText;
    message.innerText = "님이 질문 횟수 초과로 인해 승리하셨습니다.\n 새로운 게임을 진행해주세요. ";
  }

    name.classList.add('output__user__name');
    message.classList.add('output__user__message');

    wrap.classList.add('output__user');
    wrap.dataset.id = socket.id;
    chatcount=chatcount+1;
    if(chatcount>20){

      alert("질문 횟수 초과로 인한 출제자 승리");
      chatWindow.innerText = '';
      chatWindow2.innerText = '';
      chatcount=0;
    }

    wrap.appendChild(name);
    wrap.appendChild(message);

    return wrap;
}
