import React from "react";
import ReactMarkdown from "react-markdown";
import Timeline from "./projects/Timeline.md";
import SimpleAiChat from "./projects/Simple AI Chat.md";
import PlainTextNote from "./projects/Plain Text Note.md";

const App = () =>{
  return (
    <>
      <ReactMarkdown>
        *(Building in progress...)*  
      </ReactMarkdown>
      <ReactMarkdown children={`${Timeline}`} />
      <ReactMarkdown children={`${SimpleAiChat}`} />
      <ReactMarkdown children={`${PlainTextNote}`} />
    </>
  )
}

export default App
