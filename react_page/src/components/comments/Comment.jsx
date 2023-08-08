import CommentForm from "./CommentForm";

const Comment = ({
  comment,
  replies,
  userIcon,
  currentUser,
  deleteComment,
  updateComment,
  activeComment,
  addComment,
  setActiveComment,
  parentId = null,
  currentAudioId,
}) => {
  const canReply = Boolean(currentUser.id);
  const canEdit = currentUser.id === comment.userId;
  const canDelete = currentUser.id === comment.userId;

  const createdAt =
    new Date(comment.dateCreated).toLocaleDateString("lt-LT") +
    " " +
    new Date(comment.dateCreated).toLocaleTimeString("lt-LT");

  const isReplying =
    activeComment &&
    activeComment.type === "replying" &&
    activeComment.id === comment.id;

  const isEditing =
    activeComment &&
    activeComment.type === "editing" &&
    activeComment.id === comment.id;

  const replyId = parentId ? parentId : comment.id;

  return (
    <>
      <div className="comment">
        <div className="comment-image-container">
          <img src={userIcon} />
        </div>
        <div className="comment-right-part">
          <div className="comment-content">
            <p className="comment-author">{comment.username}</p>
            {comment.timestamp && (
              <p className="comment-timestamp">at {comment.timestamp} </p>
            )}
            <p className="comment-date">{createdAt}</p>
          </div>
          {!isEditing && <p className="comment-text">{comment.body}</p>}
          {isEditing && (
            <CommentForm
              submitLabel="Update"
              hasCancelButton
              initialText={comment.body}
              handleSubmit={(text) => updateComment(comment.id, text)}
              handleCancel={() => setActiveComment(null)}
            />
          )}
          <div className="comment-actions">
            {canReply && (
              <button
                className="btn-reply"
                onClick={() =>
                  setActiveComment({ id: comment.id, type: "replying" })
                }
              >
                Reply
              </button>
            )}
            {canEdit && (
              <button
                className="btn-edit"
                onClick={() =>
                  setActiveComment({ id: comment.id, type: "editing" })
                }
              >
                Edit
              </button>
            )}
            {canDelete && (
              <button
                className="btn-delete"
                onClick={() => deleteComment(comment.id)}
              >
                Delete
              </button>
            )}
          </div>
          {isReplying && (
            <CommentForm
              submitLabel="Reply"
              handleSubmit={(text) => addComment(text, replyId)}
            />
          )}
        </div>
      </div>
      {replies.length > 0 && (
        <div className="replies">
          {replies.map((reply) => (
            <Comment
              comment={reply}
              key={reply.id}
              replies={[]}
              userIcon={reply.userProfilePic}
              currentUser={currentUser}
              addComment={addComment}
              updateComment={updateComment}
              deleteComment={deleteComment}
              activeComment={activeComment}
              setActiveComment={setActiveComment}
              parentId={comment.id}
              currentAudioId={currentAudioId}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default Comment;
