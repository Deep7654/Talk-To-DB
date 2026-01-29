import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

export default function ProjectHome() {
  return (
    <ResizablePanelGroup direction="vertical">
      <ResizablePanel>One</ResizablePanel>
      <ResizableHandle withHandle/>
      <ResizablePanel>Two</ResizablePanel>
    </ResizablePanelGroup>
  )
}