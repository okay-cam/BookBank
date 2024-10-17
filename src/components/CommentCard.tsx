import React from "react";
import { commentsData } from "../config/config";
import styles from "../styles/comment-card.module.css";
import defaultImage from "../assets/default-image-path.jpg";

interface CommentCardProps {
    comment: commentsData;
}

const CommentCard: React.FC<CommentCardProps> = ({ comment }) => {
    return (
        <div className={styles.commentCard}>
            <img src={comment.profilePicUrl || defaultImage} alt="Profile picture" className={styles.avatar} />
            <div className={styles.commentContent}>
                <p><b>{comment.senderName}</b></p>
                <p>{comment.message}</p>
                <p className={styles.date}>{new Date(comment.date.seconds * 1000).toLocaleString()}</p>
            </div>
        </div>
    );
};

export default CommentCard;
