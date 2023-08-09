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
  // console.log(commentToScrollTo.slice(1));
  const getReplies = (commentId) => {
    return backendComments
      .filter((backendComment) => backendComment.parentId === commentId)
      .sort(
        (a, b) =>
          new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()
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
      elementToScrollTo.style.transition = "background-color 0.3s ease";
      setTimeout(() => {
        elementToScrollTo.style.backgroundColor = "";
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
      />
      <h3 className="comments-title">Comments</h3>
      <div className="comments-container">
        {rootComments.map((rootComment) => (
          <Comment
            id={rootComment.id + "c"}
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
          />
        ))}
      </div>
    </>
  );
};

export default Comments;
