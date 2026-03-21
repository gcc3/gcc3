import React from "react";

const Copyright = () => {
  const year = new Date().getFullYear();

  return (
    <div style={{ marginTop: "32px", color: "gray", fontSize: "12px" }}>
      © {year} gcc3.com
    </div>
  );
};

export default Copyright;
