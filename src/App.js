import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { Category, Note, Sidebar, Copyright } from "./components";
import styles from "./app.module.css";
import { clearHash } from "@utils/hashUtils";

const siteName = process.env.REACT_APP_NAME || "";

globalThis.content = "";

const App = () => {
  const [category, setCategory] = useState("");

  // Sidebar
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [index, setIndex] = useState({});

  // Content
  const [showCategory, setShowCategory] = useState(true);
  const [note, setNote] = useState("");

  // Initialize
  useEffect(() => {
    document.title = siteName;
    clearHash();

    // I. Load categories
    fetch("/api/categories")
      .then(response => response.json())
      .then(data => {
        const categories = data || [];

        // II. Load note list for each category
        Promise.all(
          categories.map(category =>
            fetch(`/api/categories/${category}/notes`)
              .then(response => response.json())
              .then(notes => ({ category: category, notes: notes }))
              .catch(() => ({ category: category, notes: [] }))
          )
        ).then(results => {
          const map = {};
          results.forEach(({ category, notes }) => { map[category] = notes; });
          setIndex(map);
        });

        // III. Set initial category
        if (categories.length > 0) {
          globalThis.content = "category:" + categories[0];
          setCategory(categories[0]);
          setShowCategory(true);
        }
      })
      .catch(error => console.error(error));
  }, []);

  const handleCategorySelected = nextCategory => {
    globalThis.content = "category:" + nextCategory;
    setCategory(nextCategory);
    setShowCategory(true);
  };

  const handleNoteSelected = (nextCategory, nextNote) => {
    globalThis.content = "note:" + nextCategory + "[" + nextNote + "]";
    setCategory(nextCategory);
    setShowCategory(false);
    setNote(nextNote);
  };

  return (
    <div className={clsx(styles.wrapper, styles.wrapperInlineBlock)}>
      {!isSidebarCollapsed && (
        <Sidebar
          index={index}
          onCategorySelected={handleCategorySelected}
          onNoteSelected={handleNoteSelected}
          onCollapse={() => setIsSidebarCollapsed(true)}
        />
      )}

      <div
        className={clsx(styles.contentContainer, { [styles.contentExpanded]: isSidebarCollapsed })}
      >
        <div className="content" id="main-view">
          {showCategory ? (
            <Category category={category} />
          ) : (
            <Note category={category} note_={note} />
          )}
          <Copyright />
        </div>

        {isSidebarCollapsed && (
          <div
            className={styles.expandSidebarButton}
            onClick={() => setIsSidebarCollapsed(false)}
          >
            •
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
