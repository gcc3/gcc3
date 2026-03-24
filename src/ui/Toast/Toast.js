import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import styles from "./toast.module.css";

const Toast = forwardRef((_, ref) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const timerRef = useRef(null);

  useImperativeHandle(ref, () => ({
    show(content = "") {
      setMessage(content);
      setVisible(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setVisible(false), 3000);
    },
  }));

  if (!visible) return null;
  return <div className={styles.toast}>{message}</div>;
});

export default Toast;
