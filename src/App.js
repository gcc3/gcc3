import React, { useState } from "react";
import Content from "./components/Content/Content";

const App = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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
            <h4>projects</h4>
            <h5
              id="btn-collapse-sidbar"
              className="btn-collapse-index"
              onClick={() => setIsSidebarCollapsed(true)}
            >
              {"<<"}
            </h5>
          </div>

          <p>
            <a className="subject" href="#simple-ai-chat">simple ai - chat</a>
          </p>
          <p>
            <a className="subject" href="#vscode-window-color-rotator">vscode window color rotator</a>
          </p>
          <p>
            <a className="subject" href="#timeline">timeline</a>
          </p>
          <div>
            <a className="subject" href="#plain-text-note">notes</a>
            <div className="tab subject">unix note</div>
          </div>

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
          <Content />
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
