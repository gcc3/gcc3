import React from "react";
import styles from "./sidebar.module.css";
import { SITE_NAME, SITE_PUBLIC_URL } from "../../constants";
import { toNoteId, toNoteTitle } from "../../utils/textUtils";

const Sidebar = ({ categories = [], categoryNotes = {}, onCollapse }) => {
  return (
    <div className={styles.sidebar}>
      <div>
        <div className={styles.title}>
          <a href={SITE_PUBLIC_URL} className={styles.linkReset}>
            <h1 className={styles.brand}>{SITE_NAME}</h1>
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
      </div>

      {categories.map(cat => (
        <div key={cat}>
          <h4>{cat}</h4>
          {(categoryNotes[cat] || []).map(note => (
            <p key={note}>
              <a className={styles.subject} href={`#${toNoteId(cat, note)}`}>{toNoteTitle(note)}</a>
            </p>
          ))}
        </div>
      ))}

      <div className={styles.links}>
        <h5>links</h5>
        <p>
          <a href="https://github.com/gcc3"> GitHub </a>
        </p>
        <p>
          <a href="https://twitter.com/318yang">@318yang</a>
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
