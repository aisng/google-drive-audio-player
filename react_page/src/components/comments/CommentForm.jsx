import { useEffect, useRef, useState } from "react";

const CommentForm = ({
  handleSubmit,
  submitLabel,
  hasCancelButton = false,
  initialText = "",
  handleCancel,
  currentSongId,
  timestamp,
}) => {
  const [text, setText] = useState(initialText);
  const textAreaRef = useRef(null);

  const isTextAreaDisabled = text.length === 0 || text.length > 1000;

  const resizeTextArea = () => {
    textAreaRef.current.style.height = "2rem";
    textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit(text, null, currentSongId, timestamp);
    setText("");
  };

  useEffect(resizeTextArea, [text]);
  return (
    <>
      <form className="comment-form" onSubmit={onSubmit}>
        <textarea
          ref={textAreaRef}
          className="comment-form-textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment..."
        ></textarea>

        {hasCancelButton && (
          <button
            type="button"
            className="comment-form-button comment-form-cancel-button"
            onClick={handleCancel}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="comment-form-button comment-form-button-submit"
          disabled={isTextAreaDisabled}
        >
          {submitLabel}
        </button>
      </form>
      {text.length > 1000 && (
        <div className="messages">
          <p style={{ color: "red" }}>Text must not exceed 1000 characters.</p>
        </div>
      )}
    </>
  );
};

export default CommentForm;
