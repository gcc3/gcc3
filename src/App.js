import React, { useEffect, useState } from "react";
import Content from "./components/Content/Content";
import Sidebar from "./components/Sidebar/Sidebar";
import Copyright from "./components/Copyright/Copyright";

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
        <Sidebar
          category={category}
          notes={notes}
          onCollapse={() => setIsSidebarCollapsed(true)}
        />
      )}

      <div
        className="content"
        style={isSidebarCollapsed ? { width: "100%", marginLeft: "0px" } : undefined}
      >
        <div className="content-view" id="main-view">
          <Content category={category} notes_={notes} />
          <Copyright />
        </div>

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
