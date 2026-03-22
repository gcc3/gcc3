import React from "react";
import styles from "./copyright.module.css";

const copyright = process.env.COPYRIGHT || "";

const Copyright = () => {
  return (
    <div className={styles.copyright}>
      {copyright}
    </div>
  );
};

export default Copyright;
