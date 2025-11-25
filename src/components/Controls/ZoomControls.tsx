import React from 'react';
import styles from './Controls.module.css';

interface ZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  canZoomIn: boolean;
  canZoomOut: boolean;
}

const ZoomControls: React.FC<ZoomControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onReset,
  canZoomIn,
  canZoomOut,
}) => {
  return (
    <div className={styles.zoomControls}>
      <button
        className={styles.zoomButton}
        onClick={onZoomOut}
        disabled={!canZoomOut}
        title="Zoom Out"
      >
        −
      </button>
      <button
        className={styles.zoomButton}
        onClick={onZoomIn}
        disabled={!canZoomIn}
        title="Zoom In"
      >
        +
      </button>
      <button
        className={styles.zoomButton}
        onClick={onReset}
        title="Reset Zoom"
      >
        ↻
      </button>
    </div>
  );
};

export default ZoomControls;

