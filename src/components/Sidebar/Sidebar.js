import React, { useMemo, useState } from "react";
import styles from "./sidebar.module.css";
import { toNoteId, toNoteTitle, toCategoryTitle } from "../../utils/textUtils";
import { clearHash } from "@utils/hashUtils";

const siteName = process.env.REACT_APP_NAME || "";
const sitePublicUrl = process.env.REACT_APP_PUBLIC_URL || "#";
const useSearch = process.env.REACT_APP_USE_SEARCH === "true";
const links = (process.env.REACT_APP_LINKS || "").split(";").map(link => {
  const [name, url] = link.split("=").map(part => part.trim());
  return { name, url };
}).filter(link => link.name && link.url);

const handleSearchKeyDown = (event, searchText, setSearchText) => {
  if (event.key === "Escape" && searchText) {
    setSearchText("");
  }
};

const handleNoteSubjectClick = (category, note, onNoteClick) => {
  const noteId = toNoteId(category, note);

  window.setTimeout(() => {
    if (window.location.hash.includes(noteId)) {
      onNoteClick?.(category, note);
    }
  }, 0);
};

const handleCategoryTitleClick = (category, onCategoryClick) => {
  clearHash();
  onCategoryClick?.(category);
};

const Sidebar = ({
  categories = [],
  categoryNoteList = {},
  onCategoryClick,
  onNoteClick,
  onCollapse,
}) => {
  const [searchText, setSearchText] = useState("");

  const filteredCategoryNoteList = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();
    if (!keyword) {
      return categoryNoteList;
    }

    return categories.reduce((acc, cat) => {
      const filteredNotes = (categoryNoteList[cat] || []).filter(note =>
        toNoteTitle(note).toLowerCase().includes(keyword)
      );

      if (filteredNotes.length > 0) {
        acc[cat] = filteredNotes;
      }

      return acc;
    }, {});
  }, [categories, categoryNoteList, searchText]);

  return (
    <div className={styles.sidebar}>
      <div>
        <div className={styles.title}>
          <a href={sitePublicUrl} className={styles.linkReset}>
            <h1 className={styles.brand}>{siteName}</h1>
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

        {useSearch && (
          <div className={styles.search}>
            <input
              type="text"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              onKeyDown={event => handleSearchKeyDown(event, searchText, setSearchText)}
              placeholder="search notes"
              className={styles.searchInput}
              aria-label="Search notes"
            />
          </div>
        )}
      </div>

      {categories.map(cat => (
        <div key={cat}>
          {(filteredCategoryNoteList[cat] || []).length > 0 && (
            <h4
              className={styles.categoryName}
              onClick={() => handleCategoryTitleClick(cat, onCategoryClick)}
            >
              {toCategoryTitle(cat)}
            </h4>
          )}
          {(filteredCategoryNoteList[cat] || []).map(note => (
            <p key={note}>
              <a
                className={styles.subject}
                href={`#${toNoteId(cat, note)}`}
                onClick={() => handleNoteSubjectClick(cat, note, onNoteClick)}
              >
                {toNoteTitle(note)}
              </a>
            </p>
          ))}
        </div>
      ))}

      <div className={styles.links}>
        <h5>links</h5>
        {links.map(link => (
          <p key={link.name}>
            <a href={link.url}>{link.name}</a>
          </p>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
