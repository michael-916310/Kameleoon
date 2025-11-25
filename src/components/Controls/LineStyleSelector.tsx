import React from 'react';
import { LineStyle } from '../../types';
import styles from './Controls.module.css';

interface LineStyleSelectorProps {
  lineStyle: LineStyle;
  onLineStyleChange: (style: LineStyle) => void;
}

const LineStyleSelector: React.FC<LineStyleSelectorProps> = ({
  lineStyle,
  onLineStyleChange,
}) => {
  return (
    <div className={styles.selector}>
      <label className={styles.selectorLabel}>Line style:</label>
      <select
        className={styles.select}
        value={lineStyle}
        onChange={(e) => onLineStyleChange(e.target.value as LineStyle)}
      >
        <option value="line">Line</option>
        <option value="smooth">Smooth</option>
        <option value="area">Area</option>
      </select>
    </div>
  );
};

export default LineStyleSelector;

