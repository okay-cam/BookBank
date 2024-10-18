import React from "react";
import { commentsData } from "../config/config";
import styles from "../styles/comment-card.module.css";
import defaultImage from "../assets/default-image-path.jpg";
import { Link } from "react-router-dom";

interface CommentCardProps {
    comment: commentsData;
}

const CommentCard: React.FC<CommentCardProps> = ({ comment }) => {
    return (
        <div className={styles.commentCard}>
            <Link to={`/profile/${comment.senderUID}`}>
                <img src={comment.profilePicUrl || defaultImage} alt="Profile picture" className={styles.avatar} draggable="false"/>
            </Link>
            <div className={styles.commentContent}>
                <Link to={`/profile/${comment.senderUID}`} className={styles.profileLink}>
                    <p><b>{comment.senderName}</b></p>
                </Link>
                <p>{comment.message}</p>
                <p className={styles.date}>{new Date(comment.date.seconds * 1000).toLocaleString()}</p>
            </div>
        </div>
    );
};

export default CommentCard;
