import React from "react";
import styles from "./copyright.module.css";
import { COPYRIGHT } from "../../constants";

const Copyright = () => {
  return (
    <div className={styles.copyright}>
      {COPYRIGHT}
    </div>
  );
};

export default Copyright;
