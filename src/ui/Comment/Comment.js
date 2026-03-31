import { useState } from "react";
import Modal from "@ui/Modal";
import styles from "./comment.module.css";

const Comment = ({ content_, category, showToast }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => {
    setIsOpen(false);
    setEmail("");
    setComment("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !comment.trim()) return;

    setSubmitting(true);
    try {
      const response = await fetch(`/api/categories/${encodeURIComponent(category)}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content_, email: email.trim(), comment: comment.trim() }),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      showToast?.("Comment submitted!");
      handleClose();
    } catch (err) {
      console.error("Failed to submit comment:", err);
      showToast?.("Failed to submit comment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <span className={styles.commentButton} onClick={handleOpen}>
        <svg className={styles.commentIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </span>

      <Modal isOpen={isOpen} onClose={handleClose}>
        <h3 className={styles.title}>Leave a Comment</h3>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>
            Email
            <input
              className={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              disabled={submitting}
            />
          </label>
          <label className={styles.label}>
            Comment
            <textarea
              className={styles.textarea}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your comment..."
              rows={5}
              required
              disabled={submitting}
            />
          </label>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={submitting || !email.trim() || !comment.trim()}
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </Modal>
    </>
  );
};

export default Comment;
