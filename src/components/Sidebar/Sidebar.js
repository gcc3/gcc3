import React, { useMemo, useState } from "react";
import styles from "./sidebar.module.css";
import { toNoteId, toNoteTitle, toCategoryTitle, toCategoryId } from "../../utils/textUtils";
import { parseContent } from "@utils/contentUtils";
import { NOTES_LIMIT } from "@constants";

const APP_NAME = process.env.REACT_APP_NAME || "";
const USE_SEARCH = process.env.REACT_APP_USE_SEARCH === "true";
const LINKS = (process.env.REACT_APP_LINKS || "").split(";").map(link => {
  const [name, url] = link.split("=").map(part => part.trim());
  return { name, url };
}).filter(link => link.name && link.url);

const Sidebar = ({
  index = {},
  onSetContent,
  onCollapse,
}) => {
  const [searchText, setSearchText] = useState("");
  const categories = useMemo(() => Object.keys(index), [index]);

  // Note filtering based on search text
  const filteredCategoryNoteList = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();
    if (!keyword) {
      return index;
    }

    return categories.reduce((acc, cat) => {
      const filteredNotes = (index[cat] || []).filter(note =>
        toNoteTitle(note).toLowerCase().includes(keyword)
      );

      if (filteredNotes.length > 0) {
        acc[cat] = filteredNotes;
      }

      return acc;
    }, {});
  }, [categories, index, searchText]);

  const hasFilteredNotes = useMemo(
    () => categories.some(category => (filteredCategoryNoteList[category] || []).length > 0),
    [categories, filteredCategoryNoteList]
  );

  const handleSearchKeyDown = (event) => {
    if (event.key === "Escape" && searchText) {
      setSearchText("");
    }
  };

  // Category click handler
  const handleCategoryClick = (category) => {
    console.log(`category: category=${category}, categoryId=${toCategoryId(category)}`);
    const content = parseContent(globalThis.content);

    if (category === "__root__") {
      // Go to root page
      onSetContent("[category]__root__:");
      return;
    }

    if (content.type === "note") {
      // Go to category page
      onSetContent(`[category]${category}:`);
      return;
    }

    if (content.type === "category" && content.category !== category) {
      // Go to category page
      onSetContent(`[category]${category}:`);
      return;
    }

    if (content.type === "categories") {
      // If the hash is already the category id
      if (window.location.hash === `#${toCategoryId(category)}`) {
        // Go to category page
        onSetContent(`[category]${category}:`);
        return;
      }
    }
  };

  // Note click handler
  const handleNoteClick = (category, note) => {
    console.log(`note: category=${category}, note=${note}, noteid=${toNoteId(category, note)}`);
    const content = parseContent(globalThis.content);

    if (category === "__root__") {
      // If the hash is already the note id
      if (window.location.hash === `#${toNoteId(category, note)}`) {
        // Go to note page
        onSetContent(`[note]${category}:${note}`);
        return;
      }
    }

    if (content.type === "note" && (content.category !== category || content.note !== note)) {
      // Go to note page
      onSetContent(`[note]${category}:${note}`);
      return;
    }

    if (content.type === "category" && content.category === category) {
      // If the hash is already the note id
      if (window.location.hash === `#${toNoteId(category, note)}`) {
        // Go to note page
        onSetContent(`[note]${category}:${note}`);
        return;
      }
    }

    if (content.type === "category" && content.category !== category) {
      // Go to note page
      onSetContent(`[note]${category}:${note}`);
      return;
    }

    if (content.type === "categories") {
      // If the hash is already the note id
      if (window.location.hash === `#${toNoteId(category, note)}`) {
        // Go to note page
        onSetContent(`[note]${category}:${note}`);
        return;
      }
    }

    // The note is not loaded in the content.
    if (content.type !== "note") {
      // Find the index of the note in the category
      const noteIndex = (index[category] || []).findIndex(n => n === note);
      if (noteIndex >= NOTES_LIMIT) {
        // Go to note page
        onSetContent(`[note]${category}:${note}`);
        return;
      }
    }
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.stickyTop}>
        <div className={styles.title}>
          <a href={window.location.origin} className={styles.linkReset}>
            <h1 className={styles.brand}>{APP_NAME}</h1>
          </a>
        </div>

        <div className={styles.categoryRow}>
          <h5>index</h5>
          <h5
            id="btn-collapse-sidbar"
            className={styles.collapseButton}
            onClick={onCollapse}
          >
            {"<<"}
          </h5>
        </div>

        {USE_SEARCH && (
          <div className={styles.search}>
            <input
              type="text"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              onKeyDown={event => handleSearchKeyDown(event)}
              placeholder="search notes"
              className={styles.searchInput}
              aria-label="Search notes"
            />
          </div>
        )}
      </div>

      {hasFilteredNotes && (
        <div className={styles.index}>
          {categories.map(category => {
            const notes = filteredCategoryNoteList[category] || [];
            if (notes.length === 0) {
              return null;
            }

            return (
              <div className={styles.categories} key={category}>
                <a
                  className={styles.category}
                  href={`#${toCategoryId(category)}`}
                  onClick={() => handleCategoryClick(category)}
                >
                  {toCategoryTitle(category)}
                </a>
                {notes.map(note => (
                  <div key={note}>
                    <a
                      className={styles.note}
                      href={`#${toNoteId(category, note)}`}
                      onClick={() => handleNoteClick(category, note)}
                    >
                      {toNoteTitle(note)}
                    </a>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {LINKS && LINKS.length > 0 && (
        <div className={styles.links}>
          <h5>links</h5>
          {LINKS.map(link => (
            <p key={link.name}>
              <a href={link.url}>{link.name}</a>
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
