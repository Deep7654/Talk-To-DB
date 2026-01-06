'use client'

import axios from 'axios'
import React, { useState } from 'react'
import Navbar from './Navbar/Navbar'


export default function Login() {
    const [user, setUser] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit =  async (e: React.FormEvent) => {
        e.preventDefault()
         const res = await axios.post('http://localhost:4000/api/user/login',{
            username: user,
            password: password  
        },{
            withCredentials: true
        } )
        const data = res.data.message
        console.log(" Submitted:", {res}); 
        // Perform login logic here
    }   
  return (
    <div>
      {/* <Navbar /> */}
      <input type="text" placeholder="Username" value={user} onChange={(e) => setUser(e.target.value)}></input>
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
    
    <button onClick={handleSubmit}>
        Login
    </button>
    </div>
  )
}
