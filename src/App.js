import { useEffect, useState } from "react";
import clsx from "clsx";
import { Content, Sidebar } from "./components";
import { Toast, showToast } from "./ui";
import styles from "./app.module.css";
import { clearHash } from "@utils/hashUtils";
import { parseContent } from "@utils/contentUtils";

const APP_NAME = process.env.REACT_APP_NAME || "";
const USE_REALTIME = process.env.REACT_APP_USE_REALTIME === "true";
const DEFAULT_CONTENT = process.env.REACT_APP_DEFAULT_CONTENT || "[categories]";

const urlContent = new URLSearchParams(window.location.search).get("content");
if (urlContent) {
  history.replaceState(null, "", window.location.pathname);
}
const INITIAL_CONTENT = urlContent || DEFAULT_CONTENT;

globalThis.content = INITIAL_CONTENT;

const App = () => {
  // Sidebar
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [index, setIndex] = useState({});

  // Content
  const [content, setContent] = useState(INITIAL_CONTENT);
  const [reload, setReload] = useState(0);  // key trick

  // Initialize
  useEffect(() => {
    document.title = APP_NAME;
    clearHash();

    // Load index
    fetch("/api/index")
      .then(response => response.json())
      .then(data => {
        const index = data || {};
        setIndex(index);

        console.log("index:", JSON.stringify(index, null, 2));
        console.log("content:", globalThis.content);
      })
      .catch(error => console.error(error));

    if (USE_REALTIME) {
      const reloadContent = (content) => {
        console.log("reload content: " + content);
        setReload(k => k + 1);
        showToast("Content updated.");
      }
      const es = new EventSource('/api/watch');
      es.onmessage = (event) => {
        const message = event.data;

        // The message contains the changed file or category.
        console.log("message: " + message);

        // If the content.category or content.note in the message, reload component
        const content_ = globalThis.content;
        const content = parseContent(content_);
        if (content.type === "categories") {
          reloadContent(content_);
        } else if (content.type === "category" && message.includes(content.category)) {
          reloadContent(content_);
        } else if (content.type === "note" && message.includes(content.category) && message.includes(content.note)) {
          reloadContent(content_);
        }
      }
    }

    // Unmount
    return () => {
      if (USE_REALTIME) {
        es.close();
      }
    };
  }, []);

  return (
    <div className={clsx(styles.wrapper, styles.wrapperInlineBlock)}>
      <Toast />
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
          <Content content_={content} reload={reload} />
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
