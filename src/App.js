import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from 'rehype-raw'

const App = () => {
  const [contentView, setContentView] = useState("projects");
  const [timeline, setTimeline] = useState();
  const [simpleAiChat, setSimpleAiChat] = useState();
  const [plainTextNote, setPlainTextNote] = useState();
  const [unixNote, setUnixNote] = useState();

  useEffect(() => {
    fetch('/projects/Timeline.md')
      .then(response => response.text())
      .then(data => setTimeline(data))
      .catch(error => console.error(error));

    fetch('/projects/Simple AI Chat.md')
      .then(response => response.text())
      .then(data => setSimpleAiChat(data))
      .catch(error => console.error(error));

    fetch('/projects/Plain Text Note.md')
      .then(response => response.text())
      .then(data => setPlainTextNote(data))
      .catch(error => console.error(error));

    fetch('/note/.markdown/Unix Note.md')
      .then(response => response.text())
      .then(data => setUnixNote(data))
      .catch(error => console.error(error));

    window.addEventListener('changeContentView', (e) => {
      setContentView(e.detail);
    });
  }, []);

  return (
    <>
      {
        contentView === "projects" &&
        <div>
          <ReactMarkdown>
            *Welcome to [join](https://github.com/gcc3) any of the projects.*
          </ReactMarkdown>
          <div id="simple-ai-chat">
            {simpleAiChat && <ReactMarkdown children={`${simpleAiChat}`} />}
          </div>
          <div id="timeline">
            {timeline && <ReactMarkdown children={`${timeline}`} rehypePlugins={[rehypeRaw]} />}
          </div>
          <div id="plain-text-note">
            {plainTextNote && <ReactMarkdown children={`${plainTextNote}`} />}
          </div>
        </div>
      }
      {
        contentView === "notes" &&
        <div>
          {unixNote && <ReactMarkdown children={`${unixNote}`} />}
        </div>
      }
    </>
  )
}

export default App
