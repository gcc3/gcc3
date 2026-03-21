import React, { useEffect, useState } from "react";
import Content from "./components/Content/Content";

const App = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
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
    <div className="wrapper wrapper-inline-block">
      {!isSidebarCollapsed && (
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
              onClick={() => setIsSidebarCollapsed(true)}
            >
              {"<<"}
            </h5>
          </div>

          {notes.map(note => (
            <p key={note}>
              <a className="subject" href={`#note`}>{note}</a>
            </p>
          ))}

          <h4>links</h4>
          <p>
            <a href="https://github.com/gcc3"> GitHub </a>
          </p>
          <a href="https://twitter.com/318yang">@318yang</a>
        </div>
      )}

      <div
        className="content"
        style={isSidebarCollapsed ? { width: "100%", marginLeft: "0px" } : undefined}
      >
        <div className="content-view" id="main-view">
          <Content category={category} notes_={notes} />
        </div>

        <div style={{ height: "40px" }} />

        {isSidebarCollapsed && (
          <div
            id="btn-expand-sidbar"
            className="btn-collapse-index"
            style={{ display: "block", position: "fixed", bottom: "10px", fontSize: "20px", textAlign: "center" }}
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
