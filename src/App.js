import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { Category, Note, Sidebar, Copyright } from "./components";
import styles from "./app.module.css";
import { clearHash } from "@utils/hashUtils";

const siteName = process.env.REACT_APP_NAME || "";

globalThis.content = "category";

const App = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);

  // Sidebar
  const [categoryNoteList, setCategoryNoteList] = useState({});
  const [showCategory, setShowCategory] = useState(true);

  // Content
  const [note, setNote] = useState("");

  // Initialize
  useEffect(() => {
    document.title = siteName;
    clearHash();

    // I. Load categories
    fetch("/api/categories")
      .then(response => response.json())
      .then(data => setCategories(data))
      .catch(error => console.error(error));
  }, []);

  useEffect(() => {
    // II. Load note list for each category
    Promise.all(
      categories.map(cat =>
        fetch(`/api/notes/${cat}`)
          .then(response => response.json())
          .then(data => ({ cat, data }))
          .catch(() => ({ cat, data: [] }))
      )
    ).then(results => {
      const map = {};
      results.forEach(({ cat, data }) => { map[cat] = data; });
      setCategoryNoteList(map);
    });

    // III. Set initial category
    if (categories.length > 0) {
      globalThis.content = "category:" + categories[0];
      setCategory(categories[0]);
      setShowCategory(true);
    }
  }, [categories]);

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
          categories={categories}
          categoryNoteList={categoryNoteList}
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
