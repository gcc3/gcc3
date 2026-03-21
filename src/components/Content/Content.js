import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { toNoteId } from "../../utils/textUtils";

const NOTES_LIMIT = 10;

const Content = ({ category, notes_ }) => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    if (!category || !notes_?.length) {
      setNotes([]);
      return;
    }

    notes_ = notes_.slice(0, NOTES_LIMIT);
    Promise.all(notes_.map(async note_ => {
      try {
        const response = await fetch(`/notes/${category}/${note_}`);
        const content = await response.text();

        return { name: note_, content };
      } catch (error) {
        console.error(`Failed to fetch note ${note_}:`, error);
        return null;
      }
    }))
      .then(results => {
        const validResults = results.filter(result => result !== null);
        setNotes(validResults);
      });
  }, [category, notes_]);

  return (
    <>
      <ReactMarkdown>{`**${category}**`}</ReactMarkdown>
      {notes.map(note => (
        <div id={toNoteId(category, note.name)} key={note.name}>
          <ReactMarkdown children={note.content} rehypePlugins={[rehypeRaw]} />
        </div>
      ))}
    </>
  );
};

export default Content;
