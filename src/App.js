import React from "react";
import ReactMarkdown from "react-markdown";
import Timeline from "./post/Timeline.md";
import SimpleAiChat from "./post/Simple AI Chat.md";
import PlainTextNote from "./post/Plain Text Note.md";

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
