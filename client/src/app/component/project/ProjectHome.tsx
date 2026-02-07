import {
  Separator,
  Panel,
Group
} from "@/components/ui/resizable"
import AgentChat from "./agentChat/AgentChat"
import ProjectHistory from "./projectHistory/ProjecrHistory"

export default function ProjectHome() {
  const accestoken = " eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ODMxYWY2NTU4NzI3MDk1NzdhZWJjOSIsImVtYWlsIjoiZGVlcDE5OTkzMjRAZ21haWwuY29tIiwiaWF0IjoxNzcwNDUxNDg3LCJleHAiOjE3NzA0NTUwMjd9.GFMxQ-cPj-uMYouNgpNK7yIanQaUoulr-pEjjnSH-TI"
  return (
    <Group orientation="horizontal" className="h-screen">
      <Panel id="left" defaultSize="70%" minSize="50%" maxSize="80%">
        <AgentChat accestoken={accestoken}/>
      </Panel>
      <Separator className="w-[4px] bg-black/20"/>
      <Panel id="right" defaultSize="30%" minSize="20%" maxSize="50%">
        <ProjectHistory/>
      </Panel>
    </Group>
  )
}