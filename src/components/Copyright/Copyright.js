import React from "react";
import styles from "./copyright.module.css";

const Copyright = () => {
  const year = new Date().getFullYear();

  return (
    <div className={styles.copyright}>
      © {year} gcc3.com
    </div>
  );
};

export default Copyright;
