import React, { useMemo, useState } from "react";
import styles from "./sidebar.module.css";
import { SITE_NAME, SITE_PUBLIC_URL } from "../../constants";
import { toNoteId, toNoteTitle } from "../../utils/textUtils";

const Sidebar = ({ categories = [], categoryNotes = {}, onCollapse }) => {
  const [searchText, setSearchText] = useState("");

  const filteredCategoryNotes = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();

    if (!keyword) {
      return categoryNotes;
    }

    return categories.reduce((acc, cat) => {
      const filteredNotes = (categoryNotes[cat] || []).filter(note =>
        toNoteTitle(note).toLowerCase().includes(keyword)
      );

      if (filteredNotes.length > 0) {
        acc[cat] = filteredNotes;
      }

      return acc;
    }, {});
  }, [categories, categoryNotes, searchText]);

  return (
    <div className={styles.sidebar}>
      <div>
        <div className={styles.title}>
          <a href={SITE_PUBLIC_URL} className={styles.linkReset}>
            <h1 className={styles.brand}>{SITE_NAME}</h1>
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

        <div className={styles.search}>
          <input
            type="text"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            placeholder="search notes"
            className={styles.searchInput}
            aria-label="Search notes"
          />
        </div>
      </div>

      {categories.map(cat => (
        <div key={cat}>
          {(filteredCategoryNotes[cat] || []).length > 0 && <h4>{cat}</h4>}
          {(filteredCategoryNotes[cat] || []).map(note => (
            <p key={note}>
              <a className={styles.subject} href={`#${toNoteId(cat, note)}`}>{toNoteTitle(note)}</a>
            </p>
          ))}
        </div>
      ))}

      <div className={styles.links}>
        <h5>links</h5>
        <p>
          <a href="https://github.com/gcc3"> GitHub </a>
        </p>
        <p>
          <a href="https://twitter.com/318yang">@318yang</a>
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
