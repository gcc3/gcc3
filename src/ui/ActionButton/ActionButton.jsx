import React from "react";
import styles from "./action.module.css";

export default function ActionButton({ tooltip, onClick, children }) {
  const child = React.Children.only(children);
  const isSvgChild = React.isValidElement(child) && typeof child.type === "string" && child.type.toLowerCase() === "svg";

  const content = isSvgChild ? React.cloneElement(child, { className: styles.icon }) : child;

  return (
    <button type="button" className={styles.actionButton} data-tooltip={tooltip} onClick={onClick}>
      {content}
    </button>
  );
}
