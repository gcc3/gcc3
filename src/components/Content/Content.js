import React, { useEffect, useState } from "react";
import Markdown from "@ui/Markdown";
import { toCategoryTitle, toNoteId, toCategoryId } from "@utils/textUtils";
import { parseContent, parseContent_ } from "@utils/contentUtils";
import styles from "./content.module.css";
import { Copyright } from "@components";
import clx from "clsx";
import { NOTES_LIMIT, BASE_PATH } from "@constants";
import { Toast, showToast, Share, Comment } from "@ui";

const Content = ({ content_ = "", reload = 0 }) => {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState(() => parseContent(content_));
  const [note, setNote] = useState(null);
  const [categoryNotes, setCategoryNotes] = useState([]);
  const [categoriesNotes, setCategoriesNotes] = useState({});

  useEffect(() => {
    setContent(parseContent(content_));
  }, [content_, reload]);

  const headerClickHandler = (content) => {
    globalThis.content = parseContent_(content);
    setContent(content);
  };

  if (content.type === "null") {
    return <>Not found.</>;
  }

  useEffect(() => {
    let isCancelled = false;

    // Load a note
    if (content.type === "note") {
      setLoading(true);

      // Fetch the note content
      let url = "";
      if (content.category === "__root__") {
        url = `${BASE_PATH}/notes/${content.note}`;
      } else {
        url = `${BASE_PATH}/notes/${content.category}/${content.note}`;
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

      fetch(`${BASE_PATH}/api/categories/${content.category}/notes`)
        .then(response => response.json())
        .then(data => {
          const notes_ = data || [];
          const limitedNotes = notes_.slice(0, NOTES_LIMIT);

          // Fetch content for each note
          return Promise.all(limitedNotes.map(async note_ => {
            try {
              let url = "";
              if (content.category === "__root__") {
                url = `${BASE_PATH}/notes/${note_}`;
              } else {
                url = `${BASE_PATH}/notes/${content.category}/${note_}`;
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

      fetch(`${BASE_PATH}/api/categories`)
        .then(response => response.json())
        .then(categories => {
          const categories_ = categories || [];

          return Promise.all(categories_.map(async category_ => {
            try {
              const notesResponse = await fetch(`${BASE_PATH}/api/categories/${category_}/notes`);
              const notes_ = await notesResponse.json();
              const limitedNotes = (notes_ || []).slice(0, NOTES_LIMIT);

              // Fetch content for each note
              const noteResults = await Promise.all(limitedNotes.map(async note_ => {
                try {
                  const response = await fetch(`${BASE_PATH}/notes/${category_}/${note_}`);
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
        ) : categoryNotes.length === 0 ? <>Not found.</> : (
          <div>
            <div className={styles.notes}>
              {categoryNotes.map(note => (
                <div id={toNoteId(content.category, note.filename)} key={note.filename} className={styles.noteAnchor}>
                  <Markdown
                    basePath={`/notes/${content.category}/`}
                    content={{ type: "note", category: content.category, note: note.filename }}
                    onHeaderClick={headerClickHandler}
                  >{note.content}</Markdown>
                  <div className={styles.actions}>
                    <Share content_={`[note]${content.category}:${note.filename}`} showToast={showToast} />
                    <Comment content_={`[note]${content.category}:${note.filename}`} category={content.category} showToast={showToast} />
                  </div>
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
        ) : !note ? <>Not found.</> : (
          <div id={toNoteId(content.category, note.filename)}>
            <div className={clx(styles.note, styles.noteAnchor)}>
              <Markdown
                basePath={`/notes/${content.category}/`}
                content={{ type: "note", category: content.category, note: note.filename }}
                onHeaderClick={headerClickHandler}
              >{note.content}</Markdown>
              <div className={styles.actions}>
                <Share content_={`[note]${content.category}:${note.filename}`} showToast={showToast} />
                <Comment content_={`[note]${content.category}:${note.filename}`} category={content.category} showToast={showToast} />
              </div>
            </div>
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
        ) : Object.keys(categoriesNotes).length === 0 ? <>Not found.</> : (
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
                          content={{ type: "note", category, note: note.filename }}
                          onHeaderClick={headerClickHandler}
                        >{note.content}</Markdown>
                        <div className={styles.actions}>
                          <Share content_={`[note]${category}:${note.filename}`} showToast={showToast} />
                          <Comment content_={`[note]${category}:${note.filename}`} category={category} showToast={showToast} />
                        </div>
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
