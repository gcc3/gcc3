import React, { useMemo, useState } from "react";
import styles from "./sidebar.module.css";
import { toNoteId, toNoteTitle, toCategoryTitle, toCategoryId } from "../../utils/textUtils";
import { parseContent } from "@utils/contentUtils";
import { NOTES_LIMIT } from "@constants";

const APP_NAME = process.env.REACT_APP_NAME || "";
const APP_SUBTITLE = process.env.REACT_APP_SUBTITLE || "";
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
    const categoryId = toCategoryId(category);
    console.log(`category: category=${category}, categoryId=${categoryId}`);

    const currentContent = parseContent(globalThis.content);
    console.log("current content:", JSON.stringify(currentContent));

    const windowHashDecoded = decodeURIComponent(window.location.hash);
    console.log("window hash (decoded):", windowHashDecoded);

    if (category === "__root__") {
      // Go to root page
      onSetContent("[category]__root__:");
      return;
    }

    if (currentContent.type === "note") {
      // Go to category page
      onSetContent(`[category]${category}:`);
      return;
    }

    if (currentContent.type === "category" && currentContent.category !== category) {
      // Go to category page
      onSetContent(`[category]${category}:`);
      return;
    }

    if (currentContent.type === "categories") {
      // If the hash is already the category id
      if (windowHashDecoded === `#${categoryId}`) {
        // Go to category page
        onSetContent(`[category]${category}:`);
        return;
      }
    }
  };

  // Note click handler
  const handleNoteClick = (category, note) => {
    const noteId = toNoteId(category, note);
    console.log(`note: category=${category}, note=${note}, noteid=${noteId}`);

    const currentContent = parseContent(globalThis.content);
    console.log("current content:", JSON.stringify(currentContent));

    const windowHashDecoded = decodeURIComponent(window.location.hash);
    console.log("window hash (decoded):", windowHashDecoded);

    if (category === "__root__") {
      if (currentContent.type === "categories" || currentContent.category !== "__root__") {
        // Go to note page
        onSetContent(`[note]__root__:${note}`);
        return;
      }

      // If the hash is already the note id
      if (windowHashDecoded === `#${noteId}`) {
        // Go to note page
        onSetContent(`[note]${category}:${note}`);
        return;
      }
    }

    if (currentContent.type === "note" && (currentContent.category !== category || currentContent.note !== note)) {
      // Go to note page
      onSetContent(`[note]${category}:${note}`);
      return;
    }

    if (currentContent.type === "category" && currentContent.category === category) {
      // If the hash is already the note id
      if (windowHashDecoded === `#${noteId}`) {
        // Go to note page
        onSetContent(`[note]${category}:${note}`);
        return;
      }
    }

    if (currentContent.type === "category" && currentContent.category !== category) {
      // Go to note page
      onSetContent(`[note]${category}:${note}`);
      return;
    }

    if (currentContent.type === "categories") {
      // If the hash is already the note id
      if (windowHashDecoded === `#${noteId}`) {
        // Go to note page
        onSetContent(`[note]${category}:${note}`);
        return;
      }
    }

    // The note is not loaded in the content.
    if (currentContent.type !== "note") {
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
          {APP_SUBTITLE && <div className={styles.subtitle}>{APP_SUBTITLE}</div>}
        </div>

        <div className={styles.categoryRow}>
          <h5>index</h5>
          <h5
            className={styles.collapseButton}
            onClick={onCollapse}
          >
            {"←"}
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
              <div className={styles.category} key={category}>
                <div>
                  <a
                    className={styles.categoryName}
                    href={`#${toCategoryId(category)}`}
                    onClick={() => handleCategoryClick(category)}
                  >
                    {toCategoryTitle(category)}
                  </a>
                </div>
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
        <div className={styles.linksContainer}>
          <div className={styles.linksLabel}>links</div>
          <div className={styles.links}>
            {LINKS.map(link => (
              <div key={link.name}>
                <a href={link.url}>{link.name}</a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
