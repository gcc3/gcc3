import React, { useEffect, useState } from "react";
import Markdown from "../../ui/Markdown";
import { toNoteId } from "../../utils/textUtils";

const NOTES_LIMIT = 10;

const Content = ({ category, notes_ }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!category || !notes_?.length) {
      setNotes([]);
      return;
    }

    setLoading(true);
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
      })
      .finally(() => setLoading(false));
  }, [category, notes_]);

  return (
    <>
      {category ? <Markdown>{`**${category}**`}</Markdown> : null}
      {loading ? (
        <h5 style={{ fontWeight: "normal" }}>Loading...</h5>
      ) : (
        notes.map(note => (
          <div id={toNoteId(category, note.name)} key={note.name}>
            <Markdown>{note.content}</Markdown>
          </div>
        ))
      )}
    </>
  );
};

export default Content;
