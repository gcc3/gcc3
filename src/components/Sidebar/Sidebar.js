import React from "react";
import styles from "./sidebar.module.css";
import { SITE_NAME, SITE_PUBLIC_URL } from "../../constants";

const Sidebar = ({ category, notes, onCollapse }) => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.title}>
        <a href={SITE_PUBLIC_URL} className={styles.linkReset}>
          <h1 className={styles.brand}>{SITE_NAME}</h1>
        </a>
      </div>

      <div className={styles.categoryRow}>
        <h4>{category}</h4>
        <h5
          id="btn-collapse-sidbar"
          className={styles.collapseBtn}
          onClick={onCollapse}
        >
          {"<<"}
        </h5>
      </div>

      {notes.map(note => (
        <p key={note}>
          <a className={styles.subject} href={`#${note}`}>{note.replace('.md', '').replace(/^\d+_/, '')}</a>
        </p>
      ))}

      <h4>links</h4>
      <p>
        <a href="https://github.com/gcc3"> GitHub </a>
      </p>
      <a href="https://twitter.com/318yang">@318yang</a>
    </div>
  );
};

export default Sidebar;
