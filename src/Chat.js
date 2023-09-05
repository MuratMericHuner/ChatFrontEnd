import React, { useState } from 'react';

export default function Chat({sendMessage, disconnectUser, chat, user}){
    const [message,setMessage]= useState("")

    const handleMessage=(e)=>{
        e.preventDefault()
        sendMessage(message)
        setMessage("")
    }

    const signout = ()=>{
        console.log('signout')
        disconnectUser()
      }

return(
    <div>
        <div>
            <h1>
                Welcome to Chat
            </h1>
            <div>
                     <button className='signout' onClick={signout}>Sign out</button>
                </div>
        </div>
        <div>
            <div className='main-chat'>
                <div className="feed"> 
                <ul>
                    {chat.map((message,index) => <li key={index} className={message.sender===user.username? "self" : "friend" }>
                    {message.sender !== user.username && <div className="portrait">{message.sender}</div>}
                    <div className="message">{message.messageContent}</div>
                    {message.sender === user.username && <div className="self-portrait">{message.sender}</div>}
                    </li>)}
                </ul>
                </div>
                <div className='input-container'>
                    <input className='message-input' value={message} onChange={(e)=>setMessage(e.target.value)}/>
                    <button className='submit-message'onClick={(e)=>handleMessage(e)}>Send message</button>
                </div>
            </div>
        </div>
        
    </div>
)
}