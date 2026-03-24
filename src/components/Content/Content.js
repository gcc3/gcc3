import React, { useEffect, useMemo, useState } from "react";
import Markdown from "@ui/Markdown";
import { toCategoryTitle, toNoteId, toCategoryId } from "@utils/textUtils";
import styles from "./content.module.css";
import { Copyright } from "@components";
import clx from "clsx";

const NOTES_LIMIT = 30;

function parseContent(content = "") {
  if (!content || typeof content !== "string") {
    return { type: null, category: "", note: "" };
  }

  if (content.startsWith("[category]")) {
    return {
      type: "category",
      category: content.slice("[category]".length),
      note: "",
    };
  }

  if (content.startsWith("[note]")) {
    const noteId = content.slice("[note]".length);
    const match = noteId.match(/^(.*):(.*)$/);
    if (!match) {
      return { type: null, category: "", note: "" };
    }

    return {
      type: "note",
      category: match[1],
      note: match[2],
    };
  }

  return { type: null, category: "", note: "" };
}

const Content = ({ content = "" }) => {
  const [notes, setNotes] = useState([]);
  const [singleNote, setSingleNote] = useState(null);
  const [loading, setLoading] = useState(false);

  const parsed = useMemo(() => parseContent(content), [content]);

  useEffect(() => {
    if (!parsed.type || !parsed.category) {
      setNotes([]);
      setSingleNote(null);
      setLoading(false);
      return;
    }

    let isCancelled = false;
    setLoading(true);

    if (parsed.type === "category") {
      setSingleNote(null);

      fetch(`/api/categories/${parsed.category}/notes`)
        .then(response => response.json())
        .then(data => {
          const notes_ = data || [];
          const limitedNotes = notes_.slice(0, NOTES_LIMIT);

          return Promise.all(limitedNotes.map(async note_ => {
            try {
              const response = await fetch(`/notes/${parsed.category}/${note_}`);
              if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`);
              }

              const content_ = await response.text();
              return { filename: note_, content: content_ };
            } catch (error) {
              console.error(`Failed to fetch note ${note_}:`, error);
              return null;
            }
          }));
        })
        .then(results => {
          if (isCancelled) {
            return;
          }

          const validResults = (results || []).filter(result => result !== null);
          setNotes(validResults);
        })
        .catch(() => {
          if (!isCancelled) {
            setNotes([]);
          }
        })
        .finally(() => {
          if (!isCancelled) {
            setLoading(false);
          }
        });

      return () => {
        isCancelled = true;
      };
    }

    if (parsed.type === "note") {
      setNotes([]);

      if (!parsed.note) {
        setSingleNote(null);
        setLoading(false);
        return;
      }

      fetch(`/notes/${parsed.category}/${parsed.note}`)
        .then(async response => {
          if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
          }

          const content_ = await response.text();
          return { filename: parsed.note, content: content_ };
        })
        .then(result => {
          if (!isCancelled) {
            setSingleNote(result);
          }
        })
        .catch(error => {
          if (!isCancelled) {
            console.error(`Failed to fetch note ${parsed.note}:`, error);
            setSingleNote(null);
          }
        })
        .finally(() => {
          if (!isCancelled) {
            setLoading(false);
          }
        });

      return () => {
        isCancelled = true;
      };
    }
  }, [parsed]);

  if (!parsed.type || !parsed.category) {
    return null;
  }

  return (
    <div>
      {parsed.type === "category" ? (
        <div id={toCategoryId(parsed.category)} className={clx(styles.categoryName, styles.categoryAnchor)}>
          {toCategoryTitle(parsed.category)}
        </div>
      ) : null}

      {loading ? (
        <div className={styles.loading}>Loading...</div>
      ) : parsed.type === "category" ? (
        <div>
          <div className={styles.notes}>
            {notes.map(note => (
              <div id={toNoteId(parsed.category, note.filename)} key={note.filename} className={styles.noteAnchor}>
                <Markdown basePath={`/notes/${parsed.category}/`}>{note.content}</Markdown>
              </div>
            ))}
          </div>
          <Copyright />
        </div>
      ) : !singleNote ? null : (
        <div id={toNoteId(parsed.category, singleNote.filename)} key={singleNote.filename} className={styles.noteAnchor}>
          <div className={styles.note}>
            <Markdown basePath={`/notes/${parsed.category}/`}>{singleNote.content}</Markdown>
          </div>
          <Copyright />
        </div>
      )}
    </div>
  );
};

export default Content;
