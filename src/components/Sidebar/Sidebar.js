import React from "react";
import styles from "./sidebar.module.css";

const Sidebar = ({ category, notes, onCollapse }) => {
  return (
    <div className="sidebar">
      <div className="title">
        <a href="https://www.gcc3.com" className={styles.linkReset}>
          <h1 className={styles.brandMain}>GCC</h1>
          <div className={styles.brandSup}>3</div>
          <div id="label-lab">lab</div>
        </a>
      </div>

      <div className={styles.categoryRow}>
        <h4>{category}</h4>
        <h5
          id="btn-collapse-sidbar"
          className="btn-collapse-index"
          onClick={onCollapse}
        >
          {"<<"}
        </h5>
      </div>

      {notes.map(note => (
        <p key={note}>
          <a className="subject" href={`#${note}`}>{note.replace('.md', '').replace(/^\d+_/, '')}</a>
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
