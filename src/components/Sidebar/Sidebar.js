import React from "react";

const Sidebar = ({ category, notes, onCollapse }) => {
  return (
    <div className="sidebar">
      <div className="title">
        <a href="https://www.gcc3.com" style={{ textDecoration: "none" }}>
          <h1 style={{ display: "inline" }}>GCC</h1>
          <div style={{ display: "inline", verticalAlign: "top" }}>3</div>
          <div id="label-lab">lab</div>
        </a>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", height: "38px" }}>
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
          <a className="subject" href={`#${note}`}>{note}</a>
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
