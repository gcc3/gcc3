import React, { useEffect, useMemo, useState } from "react";
import Markdown from "@ui/Markdown";
import { Share } from "@ui";
import { toCategoryTitle, toNoteId, toCategoryId } from "@utils/textUtils";
import { parseContent, toContentUrl } from "@utils/contentUtils";
import styles from "./content.module.css";
import { Copyright } from "@components";
import clx from "clsx";
import { NOTES_LIMIT } from "@constants";
import { Toast, showToast } from "@ui";

const Content = ({ content_ = "", reload = 0 }) => {
  const [loading, setLoading] = useState(false);

  const content = useMemo(() => parseContent(content_), [content_, reload]);
  if (content.type === "null") {
    return <>Not found.</>;
  }

  const [note, setNote] = useState(null);
  const [categoryNotes, setCategoryNotes] = useState([]);
  const [categoriesNotes, setCategoriesNotes] = useState({});

  useEffect(() => {
    let isCancelled = false;

    // Load a note
    if (content.type === "note") {
      setLoading(true);

      // Fetch the note content
      let url = "";
      if (content.category === "__root__") {
        url = `/notes/${content.note}`;
      } else {
        url = `/notes/${content.category}/${content.note}`;
      }
      fetch(url)
        .then(async response => {
          if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
          }

          const content_ = await response.text();
          return { filename: content.note, content: content_ };
        })
        .then(result => {
          if (!isCancelled) {
            setNote(result);
          }
        })
        .catch(error => {
          if (!isCancelled) {
            console.error(`Failed to fetch note ${content.note}:`, error);
            setNote(null);
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

    // Load a category
    if (content.type === "category") {
      setLoading(true);

      fetch(`/api/categories/${content.category}/notes`)
        .then(response => response.json())
        .then(data => {
          const notes_ = data || [];
          const limitedNotes = notes_.slice(0, NOTES_LIMIT);

          // Fetch content for each note
          return Promise.all(limitedNotes.map(async note_ => {
            try {
              let url = "";
              if (content.category === "__root__") {
                url = `/notes/${note_}`;
              } else {
                url = `/notes/${content.category}/${note_}`;
              }

              const response = await fetch(url);
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
          setCategoryNotes(validResults);
        })
        .catch(() => {
          if (!isCancelled) {
            setCategoryNotes([]);
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

    // Load all categories and notes
    if (content.type === "categories") {
      setLoading(true);

      fetch(`/api/categories`)
        .then(response => response.json())
        .then(categories => {
          const categories_ = categories || [];

          return Promise.all(categories_.map(async category_ => {
            try {
              const notesResponse = await fetch(`/api/categories/${category_}/notes`);
              const notes_ = await notesResponse.json();
              const limitedNotes = (notes_ || []).slice(0, NOTES_LIMIT);

              // Fetch content for each note
              const noteResults = await Promise.all(limitedNotes.map(async note_ => {
                try {
                  const response = await fetch(`/notes/${category_}/${note_}`);
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

              return { category: category_, notes: noteResults.filter(n => n !== null) };
            } catch (error) {
              console.error(`Failed to fetch notes for category ${category_}:`, error);
              return { category: category_, notes: [] };
            }
          }));
        })
        .then(results => {
          if (isCancelled) return;
          const map = {};
          (results || []).forEach(({ category, notes }) => {
            map[category] = notes;
          });
          setCategoriesNotes(map);
        })
        .catch(() => {
          if (!isCancelled) {
            setCategoriesNotes({});
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
  }, [content]);

  if (content.type === "category") {
    return (
      <div>
        <Toast />
        <div id={toCategoryId(content.category)} className={clx(styles.categoryName, styles.categoryAnchor)}>
          {toCategoryTitle(content.category)}
        </div>
        {loading ? (
          <div className={styles.loading}>Loading...</div>
        ) : (
          <div>
            <div className={styles.notes}>
              {categoryNotes.map(note => (
                <div id={toNoteId(content.category, note.filename)} key={note.filename} className={styles.noteAnchor}>
                  <Markdown
                    basePath={`/notes/${content.category}/`}
                    url={toContentUrl({ type: "note", category: content.category, note: note.filename })}
                  >{note.content}</Markdown>
                </div>
              ))}
            </div>
            <Copyright />
          </div>
        )}
      </div>
    )
  }

  if (content.type === "note") {
    return (
      <div>
        <Toast />
        {loading ? (
          <div className={styles.loading}>Loading...</div>
        ) : !note ? null : (
          <div id={toNoteId(content.category, note.filename)}>
            <div className={clx(styles.note, styles.noteAnchor)}>
              <Markdown
                basePath={`/notes/${content.category}/`}
              >{note.content}</Markdown>
            </div>
            <Share content_={content_} showToast={showToast} />
            <Copyright />
          </div>
        )}
      </div>
    )
  }

  if (content.type === "categories") {
    return (
      <div>
        <Toast />
        {loading ? (
          <div className={styles.loading}>Loading...</div>
        ) : (
          <div>
            <div className={styles.categories}>
              {Object.entries(categoriesNotes).map(([category, notes]) => (
                <div key={category}>
                  <div id={toCategoryId(category)} className={clx(styles.categoryName, styles.categoryAnchor)}>
                    {toCategoryTitle(category)}
                  </div>
                  <div className={styles.notes}>
                    {notes.map(note => (
                      <div id={toNoteId(category, note.filename)} key={note.filename} className={styles.noteAnchor}>
                        <Markdown
                          basePath={`/notes/${category}/`}
                          url={toContentUrl({ type: "note", category, note: note.filename })}
                        >{note.content}</Markdown>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <Copyright />
          </div>
        )}
      </div>
    );
  }

  return <></>;
};

export default Content;
