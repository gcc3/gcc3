import React from "react";
import styles from "./sidebar.module.css";
import { SITE_NAME, SITE_PUBLIC_URL } from "../../constants";

const Sidebar = ({ categories = [], categoryNotes = {}, onCollapse }) => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.title}>
        <a href={SITE_PUBLIC_URL} className={styles.linkReset}>
          <h1 className={styles.brand}>{SITE_NAME}</h1>
        </a>
      </div>

      <div className={styles.categoryRow}>
        <h5>notes</h5>
        <h5
          id="btn-collapse-sidbar"
          className={styles.collapseButton}
          onClick={onCollapse}
        >
          {"<<"}
        </h5>
      </div>

      {categories.map(cat => (
        <div key={cat}>
          <h4>{cat}</h4>
          {(categoryNotes[cat] || []).map(note => (
            <p key={note}>
              <a className={styles.subject} href={`#${note}`}>{note.replace('.md', '').replace(/^\d+_/, '')}</a>
            </p>
          ))}
        </div>
      ))}

      <h5>links</h5>
      <p>
        <a href="https://github.com/gcc3"> GitHub </a>
      </p>
      <a href="https://twitter.com/318yang">@318yang</a>
    </div>
  );
};

export default Sidebar;
