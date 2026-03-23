import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { Content, Sidebar } from "./components";
import styles from "./app.module.css";
import { clearHash } from "@utils/hashUtils";

const siteName = process.env.REACT_APP_NAME || "";

globalThis.content = "";

const App = () => {
  // Sidebar
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [index, setIndex] = useState({});

  // Content
  const [content, setContent] = useState("");

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
          const initialContent = "category:" + categories[0];
          globalThis.content = initialContent;
          setContent(initialContent);
        }
      })
      .catch(error => console.error(error));
  }, []);

  const handleCategorySelected = nextCategory => {
    const nextContent = "category:" + nextCategory;
    globalThis.content = nextContent;
    setContent(nextContent);
  };

  const handleNoteSelected = (nextCategory, nextNote) => {
    const nextContent = "note:" + nextCategory + "[" + nextNote + "]";
    globalThis.content = nextContent;
    setContent(nextContent);
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
          <Content content={content} />
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
