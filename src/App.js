import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { Category, Note, Sidebar, Copyright } from "./components";
import styles from "./app.module.css";
import { clearHash } from "@utils/hashUtils";

const siteName = process.env.REACT_APP_NAME || "";

const App = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);

  // Sidebar
  const [categoryNoteList, setCategoryNoteList] = useState({});
  const [selectedNote, setSelectedNote] = useState("");

  // Content
  const [notes, setNotes] = useState([]);

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
      setCategory(categories[0]);
      setSelectedNote("");
    }
  }, [categories]);

  useEffect(() => {
    if (!category) {
      setNotes([]);
      return;
    }

    fetch(`/api/notes/${category}`)
      .then(response => response.json())
      .then(data => setNotes(data))
      .catch(error => console.error(error));
  }, [category]);

  const handleCategoryClick = nextCategory => {
    setCategory(nextCategory);
    setSelectedNote("");
  };

  const handleNoteClick = (nextCategory, nextNote) => {
    setCategory(nextCategory);
    setSelectedNote(nextNote);
  };

  return (
    <div className={clsx(styles.wrapper, styles.wrapperInlineBlock)}>
      {!isSidebarCollapsed && (
        <Sidebar
          categories={categories}
          categoryNoteList={categoryNoteList}
          onCategoryClick={handleCategoryClick}
          onNoteClick={handleNoteClick}
          onCollapse={() => setIsSidebarCollapsed(true)}
        />
      )}

      <div
        className={clsx(styles.contentContainer, { [styles.contentExpanded]: isSidebarCollapsed })}
      >
        <div className="content" id="main-view">
          {selectedNote ? (
            <Note category={category} note_={selectedNote} />
          ) : (
            <Category category={category} notes_={notes} />
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
