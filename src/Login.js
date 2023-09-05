import React, { useState } from 'react'
import axios from 'axios'

const url = 'http://localhost:8080/api/auth'

export default function Login({handleConnection, showError, error}){
    const [isLogIn, setIsLogin] = useState(true)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [username, setUserName] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const viewLogin = (status) => {
        showError(null)
        setIsLogin(status)
      }
    
      const handleREgister = async (e, endpoint) => {
        e.preventDefault()
        const regExp = /[a-zA-Z0-9._]+@[a-z]+\.[a-z]{2,6}$/

        if (password !== confirmPassword) {
          showError('Make sure passwords match!')
          return
        }
        if(email==="" || !regExp.test(email)){
          showError("Please enter a valid mail")
          return
        }
          const response = await axios.post(`${url}/${endpoint}`, {username, email, password})
          if(response.data.statusCode===400){
            showError(response.data.message)
          }else{
            handleConnection(response.data.data.User.username, email, response.data.data.User.email)
          }
      }

      const handleLogin = async (e, endpoint) => {
        e.preventDefault()

          const response = await axios.post(`${url}/${endpoint}`, {email, password})
          if(response.data.statusCode===400){
            showError(response.data.message)
          }else{
            handleConnection(response.data.data.User.username, email, response.data.data.User.email)
          }
      }
    
    return (
        <div className="auth-container">
          <div className="auth-container-box">
            <form>
              <h2>{isLogIn  ? 'Please log in' : 'Please sign up!'}</h2>
              {!isLogIn && <input
                type="username"
                placeholder="username"
                onChange={(e) => setUserName(e.target.value)}
              />}
              <input
                type="email"
                placeholder="email"
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="password"
                onChange={(e) => setPassword(e.target.value)}
              />
              {!isLogIn && <input
                type="password"
                placeholder="confirm password"
                onChange={(e) =>setConfirmPassword(e.target.value)}
              />}
              <input type="submit" className="create" onClick={isLogIn? (e) => handleLogin(e,'authenticate') : (e) => handleREgister(e,'register') } />
            </form>
            <div className="auth-options">
              <button
                onClick={() => viewLogin(false)}
                style={{backgroundColor : !isLogIn ? 'rgb(255, 255, 255)' : 'rgb(188, 188, 188)'}}
              >Sign Up</button>
              <button
                onClick={() => viewLogin(true)}
                style={{backgroundColor : isLogIn ? 'rgb(255, 255, 255)' : 'rgb(188, 188, 188)'}}
              >Login</button>
            </div>
              {error && <p className='errorMessage'>{error}</p>}
          </div>
        </div>
      )
}