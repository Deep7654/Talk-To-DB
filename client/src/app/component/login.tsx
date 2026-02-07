// // // 'use client'

// // // import axios from 'axios'
// // // import React, { useState } from 'react'
// // // import Navbar from './Navbar/Navbar'


// // // export default function Login() {
// // //     const [user, setUser] = useState("")
// // //     const [password, setPassword] = useState("")

// // //     const handleSubmit =  async (e: React.FormEvent) => {
// // //         e.preventDefault()
// // //          const res = await axios.post('http://localhost:4000/api/user/login',{
// // //             username: user,
// // //             password: password  
// // //         },{
// // //             withCredentials: true
// // //         } )
// // //         const data = res.data.message
// // //         console.log(" Submitted:", {res}); 
// // //         // Perform login logic here
// // //     }   
// // //   return (
// // //     <div>
// // //       {/* <Navbar /> */}
// // //       <input type="text" placeholder="Username" value={user} onChange={(e) => setUser(e.target.value)}></input>
// // //       <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
    
// // //     <button onClick={handleSubmit}>
// // //         Login
// // //     </button>
// // //     </div>
// // //   )
// // // }


// // "use client";

// // import {useState} from "react";

// // export default function StreamTestPage() {
// //   const [output,setOutput]=useState("");
// //   const [loading,setLoading]=useState(false);

// //   const startStream=async()=>{
// //     setOutput("");
// //     setLoading(true);

// //     const response=await fetch("http://localhost:4000/api/chat",{
// //       method:"POST",
// //       headers:{
// //         "Content-Type":"application/json"
// //       },
// //       body:JSON.stringify({
// //         messages:[
// //           {role:"user",content:"Write a long poem about the ocean with imagery 5 lines."}
// //         ]
// //       })
// //     });

// //     if(!response.body){
// //       throw new Error("No response body");
// //     }

// //     const reader=response.body.getReader();
// //     const decoder=new TextDecoder();

// //     while(true){
// //       const {value,done}=await reader.read();
// //       if(done)break;

// //       const chunk=decoder.decode(value,{stream:true});
// //       setOutput(prev=>prev+chunk);
// //     }

// //     setLoading(false);
// //   };

// //   return(
// //     <div style={{padding:20}}>
// //       <button onClick={startStream} disabled={loading}>
// //         {loading?"Streaming...":"Start Streaming"}
// //       </button>

// //       <pre style={{
// //         marginTop:20,
// //         whiteSpace:"pre-wrap",
// //         border:"1px solid #ccc",
// //         padding:10
// //       }}>
// //         {output}
// //       </pre>
// //     </div>
// //   );
// // }


"use client";

import { useState } from "react";

export default function SSETest() {
  const [log, setLog] = useState<string[]>([]);

  const start = async () => {
    setLog([]);

    const res = await fetch("http://localhost:4000/api/user/agentChat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: [{ role: "user", content: "Write a poem about the sea" }]
      })
    });

    const reader = res.body!.getReader();
    const decoder = new TextDecoder();

    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // Parse SSE frames
      const parts = buffer.split("\n\n");
      buffer = parts.pop()!;

      for (const part of parts) {
        if (part.startsWith("data: ")) {
          const json = part.replace("data: ", "");
          const event = JSON.parse(json);
          setLog(prev => [...prev, JSON.stringify(event)]);
        }
      }
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <button onClick={start}>Start SSE</button>
      <pre style={{ marginTop: 16, whiteSpace: "pre-wrap" }}>
        {log.join("\n")}
      </pre>
    </div>
  );
}

// 'use client';

// import { useChat } from '@ai-sdk/react';

// export default function Chat() {
//   // 1. Destructure 'setInput' instead of 'handleInputChange'
//   const { messages, input, setInput, handleSubmit } = useChat({
//     api: 'http://localhost:4000/api/chat',
//   });

//   return (
//     <div>
//       <div className="chat-window">
//         {messages.map(m => (
//           <div key={m.id}>
//             <strong>{m.role === 'user' ? 'You: ' : 'AI: '}</strong>
//             {m.content}
//           </div>
//         ))}
//       </div>

//       <form onSubmit={handleSubmit}>
//         <input
//           value={input}
//           placeholder="Say something..."
//           // 2. Manually handle the change. This is all handleInputChange did anyway.
//           onChange={(e) => setInput(e.target.value)} 
//         />
//         <button type="submit">Send</button>
//       </form>
//     </div>
//   );
// }