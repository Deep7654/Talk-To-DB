import { useState } from "react"


export default function ProjectHistory() {
    const [search, setSearch] = useState('');
  return (
    <div className="p-4">
        <input type="text" placeholder="Search" className="w-full p-2 border rounded"/>
    </div>
  )
}
