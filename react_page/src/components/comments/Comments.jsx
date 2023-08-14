import { useState, useEffect } from "react";
import Comment from "./Comment";
import CommentForm from "./CommentForm";
import {
  getComments,
  createComment,
  deleteComment,
  updateComment,
} from "../../apiService";

const Comments = ({
  currentUser,
  currentSongId,
  timestamp,
  commentToScrollTo,
}) => {
  const [backendComments, setBackendComments] = useState([]);
  const [activeComment, setActiveComment] = useState(null);
  const rootComments = backendComments.filter(
    (backendComment) =>
      backendComment.parentId === null &&
      backendComment.songId === currentSongId
  );
  const [dataLoaded, setDataLoaded] = useState(false);
  // const [hasCancelButton, setHasCancelButton] = useState(false);

  const getReplies = (commentId) => {
    return backendComments
      .filter((backendComment) => backendComment.parentId === commentId)
      .sort(
        (a, b) =>
          new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime()
      );
  };

  const handleCommentSubmit = (
    text,
    parentId = null,
    currentSongId = null,
    timestamp = null
  ) => {
    const commentData = {
      body: text,
      user_id: currentUser.id,
      parent_id: parentId,
      timestamp: timestamp,
      song_id: currentSongId,
    };
    createComment(commentData).then((response) => {
      console.log("SENT", commentData);
      console.log("RECEIVED", response.data);
      setBackendComments([response.data, ...backendComments]);
      setActiveComment(null);
    });
  };

  const handleCommentDelete = (commentId) => {
    if (window.confirm("Remove this comment?")) {
      deleteComment(commentId).then((response) => {
        console.log(response);
        setBackendComments(
          backendComments.filter(
            (backendComment) => backendComment.id !== commentId
          )
        );
        setActiveComment(null);
      });
    }
  };

  const handleCommentUpdate = (commentId, text) => {
    updateComment(commentId, { body: text }).then((response) => {
      console.log(response);

      const updatedBackendComments = backendComments.map((backendComment) => {
        if (backendComment.id === commentId) {
          return { ...backendComment, body: text };
        }
        return backendComment;
      });
      setBackendComments(updatedBackendComments);
      setActiveComment(null);
    });
  };

  const handleCancel = () => {
    if (activeComment) {
      setActiveComment(null);
    }
  };

  useEffect(() => {
    // const hash = window.location.hash;
    if (dataLoaded && commentToScrollTo) {
      // console.log(hash.split("/")[0]);
      const elementToScrollTo = document.getElementById(
        commentToScrollTo.slice(1)
      );
      elementToScrollTo.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      elementToScrollTo.style.backgroundColor = "#ffffe0";
      elementToScrollTo.style.borderRadius = "1.5rem";
      elementToScrollTo.style.transition = "background-color 0.6s ease-in-out";
      setTimeout(() => {
        elementToScrollTo.style.backgroundColor = "";
        elementToScrollTo.style.borderRadius = "";
        elementToScrollTo.style.transition = "";
      }, 1000);
      window.history.replaceState(
        null,
        null,
        location.pathname + location.search
      );
    }
  }, [dataLoaded]);

  useEffect(() => {
    getComments().then((response) => {
      setBackendComments(response.data);
      setDataLoaded(true);
    });
  }, []);

  return (
    <>
      <CommentForm
        submitLabel="Add a comment"
        handleSubmit={handleCommentSubmit}
        currentSongId={currentSongId}
        timestamp={timestamp}
        // onFocus={() => setHasCancelButton(true)}
        // hasCancelButton
        handleCancel={handleCancel}
      />
      <h3 className="comments-title">Comments</h3>
      <div className="comments-container">
        {rootComments.map((rootComment) => (
          <Comment
            id={rootComment.id + "c"} // + "c" for locating the comment from hash
            key={rootComment.id}
            comment={rootComment}
            userIcon={rootComment.userProfilePic}
            replies={getReplies(rootComment.id)}
            currentUser={currentUser}
            deleteComment={handleCommentDelete}
            updateComment={handleCommentUpdate}
            activeComment={activeComment}
            setActiveComment={setActiveComment}
            addComment={handleCommentSubmit}
            currentSongId={currentSongId}
            handleCancel={handleCancel}
          />
        ))}
      </div>
    </>
  );
};

export default Comments;
