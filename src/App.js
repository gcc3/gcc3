import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { Content, Sidebar } from "./components";
import { Toast } from "./ui";
import styles from "./app.module.css";
import { clearHash } from "@utils/hashUtils";
import { parseContent } from "@utils/contentUtils";

const siteName = process.env.REACT_APP_NAME || "";
const defaultLoad = process.env.REACT_APP_DEFAULT_LOAD || "category";

globalThis.content = "";

const App = () => {
  // Sidebar
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [index, setIndex] = useState({});

  // Content
  const [content, setContent] = useState("");
  const [reload, setReload] = useState(0);  // key trick

  // Toast
  const toastRef = React.useRef(null);
  const showToast = (content = "") => toastRef.current?.show(content);

  // Initialize
  useEffect(() => {
    document.title = siteName;
    clearHash();

    // Set up SSE connection to receive real-time updates when notes change
    const reloadContent = (content) => {
      console.log("reload content: " + (content ? content : "(all categories)"));
      setReload(k => k + 1);
      showToast("Content updated.");
    }
    const es = new EventSource('/api/watch');
    es.onmessage = (event) => {
      const message = event.data;
      console.log("message: " + message);

      // If the content.category or content.note in the message, reload component
      const content_ = globalThis.content;
      const content = parseContent(content_);
      if (content.type === "") {
        reloadContent(content_);
      } else if (content.type === "category" && message.includes(content.category)) {
        reloadContent(content_);
      } else if (content.type === "note" && message.includes(content.category) && message.includes(content.note)) {
        reloadContent(content_);
      }
    }

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

        // I and II will finish set `index`.

        // III. Set initial content
        // `category`              → load the first category
        // `categories`            → load all categories
        // `category_name`         → load a specific category, e.g. `Life`
        // `category_name:note`    → load a specific note, e.g. `Life:Note1.txt`
        let content_ = "";
        if (defaultLoad === "categories") {
          content_ = "";
        } else if (defaultLoad === "category") {
          content_ = categories.length > 0 ? "[category]" + categories[0] : "";
        } else if (defaultLoad.includes(":")) {
          const colonIndex = defaultLoad.indexOf(":");
          const cat = defaultLoad.slice(0, colonIndex);
          const note = defaultLoad.slice(colonIndex + 1);
          content_ = cat && note ? "[note]" + cat + ":" + note : "";
        } else if (defaultLoad) {
          content_ = "[category]" + defaultLoad;
        }

        globalThis.content = content_;
        setContent(content_);
        console.log("content:", content_ || "(all categories)");
      })
      .catch(error => console.error(error));

    // Unmount
    return () => es.close();
  }, []);

  return (
    <div className={clsx(styles.wrapper, styles.wrapperInlineBlock)}>
      <Toast ref={toastRef} />
      {!isSidebarCollapsed && (
        <Sidebar
          index={index}
          onSetContent={(content) => {
            globalThis.content = content;
            setContent(content);
            console.log("content:", content);
          }}
          onCollapse={() => setIsSidebarCollapsed(true)}
        />
      )}

      <div
        className={clsx(styles.contentContainer, { [styles.contentExpanded]: isSidebarCollapsed })}
      >
        <div className="content" id="main-view">
          <Content content_={content} reloadKey={reload} />
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
