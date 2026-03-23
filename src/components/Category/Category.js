import React, { useEffect, useState } from "react";
import Markdown from "@ui/Markdown";
import { toCategoryTitle, toNoteId } from "@utils/textUtils";
import styles from "./category.module.css";

const NOTES_LIMIT = 30;

const Category = ({ category }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!category) {
      setNotes([]);
      setLoading(false);
      return;
    }

    let isCancelled = false;

    setLoading(true);

    fetch(`/api/notes/${category}`)
      .then(response => response.json())
      .then(data => {
        const notes_ = data || [];

        console.log(`fetched notes for category ${category}:`, JSON.stringify(notes_));

        // Fetch notes content
        const limitedNotes = notes_.slice(0, NOTES_LIMIT);
        Promise.all(limitedNotes.map(async note_ => {
          try {
            const response = await fetch(`/notes/${category}/${note_}`);
            if (!response.ok) {
              throw new Error(`Request failed with status ${response.status}`);
            }
            const content = await response.text();

            return { filename: note_, content };
          } catch (error) {
            console.error(`Failed to fetch note ${note_}:`, error);
            return null;
          }
        }))
          .then(results => {
            if (!isCancelled) {
              const validResults = results.filter(result => result !== null);
              setNotes(validResults);
            }
          })
          .finally(() => {
            if (!isCancelled) {
              setLoading(false);
            }
          });
      })
      .catch(() => ({ category, data: [] }));

    return () => {
      isCancelled = true;
    };
  }, [category]);

  return (
    <>
      {category ? <Markdown>{`**${toCategoryTitle(category)}**`}</Markdown> : null}

      {loading ? (
        <div className={styles.loading}>Loading...</div>
      ) : (
        <div className={styles.notes}>
          {notes.map(note => (
            <div id={toNoteId(category, note.filename)} key={note.filename}>
              <Markdown basePath={`/notes/${category}/`}>{note.content}</Markdown>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Category;
