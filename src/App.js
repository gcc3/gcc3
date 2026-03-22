import React, { useEffect, useState } from "react";
import clsx from "clsx";
import Content from "./components/Content/Content";
import Sidebar from "./components/Sidebar/Sidebar";
import Copyright from "./components/Copyright/Copyright";
import styles from "./app.module.css";

const siteName = process.env.SITE_NAME || "";

const App = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [notes, setNotes] = useState([]);
  const [categoryNotes, setCategoryNotes] = useState({});

  useEffect(() => {
    document.title = siteName;

    fetch("/api/categories")
      .then(response => response.json())
      .then(data => setCategories(data))
      .catch(error => console.error(error));
  }, []);

  useEffect(() => {
    const firstCategory = categories[0];
    if (!firstCategory) {
      return;
    }

    setCategory(firstCategory);

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
      setCategoryNotes(map);
    });
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

  return (
    <div className={clsx(styles.wrapper, styles.wrapperInlineBlock)}>
      {!isSidebarCollapsed && (
        <Sidebar
          categories={categories}
          categoryNotes={categoryNotes}
          onCollapse={() => setIsSidebarCollapsed(true)}
        />
      )}

      <div
        className={clsx(styles.content, { [styles.contentExpanded]: isSidebarCollapsed })}
      >
        <div className="content-view" id="main-view">
          <Content category={category} notes_={notes} />
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
