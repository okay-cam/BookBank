import React from 'react';
import styles from '../styles/image-modal.module.css';

interface ImageModalProps {
  imageUrl: string;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, onClose }) => {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <span className={styles.closeButton} onClick={onClose}>&times;</span>
        <img src={imageUrl} alt="Expanded listing" className={styles.expandedImage} />
      </div>
    </div>
  );
};

export default ImageModal;
