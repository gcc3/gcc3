import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

const getNoteId = noteName => {
  if (noteName.includes("simple-ai-chat")) {
    return "simple-ai-chat";
  }

  if (noteName.includes("window-color-rotator")) {
    return "vscode-window-color-rotator";
  }

  if (noteName.includes("timeline")) {
    return "timeline";
  }

  if (noteName.includes("note")) {
    return "plain-text-note";
  }

  return noteName;
};

const Content = ({ category }) => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    if (!category) {
      return;
    }

    fetch(`/api/notes/${category}`)
      .then(response => response.json())
      .then(data => Promise.all(data.map(async note => {
        try {
          const response = await fetch(`/notes/${category}/${note}`);
          const content = await response.text();

          return { name: note, content };
        } catch (error) {
          console.error(`Failed to fetch note ${note}:`, error);
          return null;
        }
      })))
      .then(results => {
        const validResults = results.filter(result => result !== null);
        setNotes(validResults);
      })
      .catch(error => console.error(error));
  }, [category]);

  return (
    <>
      <ReactMarkdown>{category}</ReactMarkdown>
      {notes.map(note => (
        <div id={getNoteId(note.name)} key={note.name}>
          <ReactMarkdown children={note.content} rehypePlugins={[rehypeRaw]} />
        </div>
      ))}
    </>
  );
};

export default Content;
