import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import Timeline from "./projects/Timeline.md";
import SimpleAiChat from "./projects/Simple AI Chat.md";
import PlainTextNote from "./projects/Plain Text Note.md";
import UnixNote from "./note/.markdown/Unix Note.md";

const App = () => {
  const [contentView, setContentView] = useState("projects");

  useEffect(() => {
    window.addEventListener('changeContentView', (e) => {
      setContentView(e.detail);
    });
  }, []);

  return (
    <>
      <ReactMarkdown>
        *(Building in progress...)*  
      </ReactMarkdown>
      {
        contentView === "projects" &&
        <>
          <ReactMarkdown children={`${Timeline}`} />
          <ReactMarkdown children={`${SimpleAiChat}`} />
          <ReactMarkdown children={`${PlainTextNote}`} />
        </>
      }
      {
        contentView === "notes" &&
        <div>
          <ReactMarkdown children={`${UnixNote}`} />
        </div>
      }
    </>
  )
}

export default App
