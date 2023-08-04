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
  currentUserId,
  currentUsername,
  currentUser,
  currentSongId,
  timestamp,
}) => {
  const [backendComments, setBackendComments] = useState([]);
  const [activeComment, setActiveComment] = useState(null);
  const rootComments = backendComments.filter(
    (backendComment) =>
      backendComment.parentId === null &&
      backendComment.songId === currentSongId
  );
  // console.log(backendComments);
  const getReplies = (commentId) => {
    return backendComments
      .filter((backendComment) => backendComment.parentId === commentId)
      .sort(
        (a, b) =>
          new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()
      );
  };
  // TODO: remove hardcoded username when login is present
  const handleCommentSubmit = (
    text,
    parentId = null,
    currentSongId = null,
    timestamp = null
  ) => {
    const commentData = {
      body: text,
      // username: currentUsername,
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
    getComments().then((response) => {
      // console.log(response.data);
      setBackendComments(response.data);
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
            key={rootComment.id}
            comment={rootComment}
            // this doesn't work - picture is the same as current_user
            userIcon={rootComment.userProfilePic}
            replies={getReplies(rootComment.id)}
            // currentUserId={currentUser.id}
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
