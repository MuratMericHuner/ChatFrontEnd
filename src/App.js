import './App.css';
import { useState,useRef } from 'react';
import Login from './Login';
import Chat from './Chat';
import SockJS from 'sockjs-client';
import { over } from 'stompjs';

var stompClient = null;

function App() {
  const [error, setError] = useState(null)
  const [publicChat, setPublicChat]= useState([])
  const [user, setUser] = useState({
      username : "",
      email: "",
      connected : false
  })
  const nameRef = useRef("");
  const showError=(val)=>{
    setError(val)
  }
  const OnConnected=()=>{
    setUser(user=> ({...user ,connected:true}))
    stompClient.subscribe('/topic/public',onMessageReceived)
    userJoin()
  }

  const userJoin=()=>{
    const chatMessage={
      sender : nameRef.current,
      messageType : "JOIN"
    }
    stompClient.send("/app/addUser",{},JSON.stringify(chatMessage))
  }

  const onError=(err)=>{
    setError(err)
  }

  const onMessageReceived= (payload)=>{
    let message = JSON.parse(payload.body)
    switch(message.messageType){
      case "JOIN":
        message.messageContent = message.sender + ' joined!';
        setPublicChat(messages =>[...messages, message])
        break;
      case "CHAT":
        setPublicChat(messages =>[...messages, message])
        break;
      case "LEAVE":
        message.messageContent = message.sender + ' left!';
        setPublicChat(messages =>[...messages, message])
        break;
    }
  }

  const sendMessage=(val)=>{
    const messageContent = val
    if(messageContent && stompClient){
      const chatMessage ={
        sender : user.username,
        messageContent : messageContent,
        messageType : "CHAT"
      }
      stompClient.send("/app/message",{},JSON.stringify(chatMessage))
    }
  }

  const disconnectUser=()=>{
    stompClient.send("/app/message",{},JSON.stringify({sender:user.username, messageType:"LEAVE"}))
    stompClient.disconnect()
    setUser(()=> {return {username : "", email: "", connected: false}})
  }
  
  const connectUser= (name,mail)=>{
    setUser(user=> ({...user , username:name, email:mail}))
    nameRef.current = name
    let Sock = new SockJS("http://localhost:8090/ws")
    stompClient= over(Sock)
    stompClient.connect({},OnConnected, onError)
  }

  return (
    <div className="app">
      {!user.connected &&<Login handleConnection={connectUser} showError={showError} error={error}/>}
      {user.connected && <Chat sendMessage={sendMessage} disconnectUser={disconnectUser} chat={publicChat} user={user}/>}   
    </div>
  );
}

export default App;
