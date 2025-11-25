import React from 'react';
import { Period } from '../../types';
import styles from './Controls.module.css';

interface PeriodSelectorProps {
  period: Period;
  onPeriodChange: (period: Period) => void;
}

const PeriodSelector: React.FC<PeriodSelectorProps> = ({
  period,
  onPeriodChange,
}) => {
  return (
    <div className={styles.selector}>
      <label className={styles.selectorLabel}>Period:</label>
      <div className={styles.buttonGroup}>
        <button
          className={`${styles.periodButton} ${period === 'day' ? styles.active : ''}`}
          onClick={() => onPeriodChange('day')}
        >
          Day
        </button>
        <button
          className={`${styles.periodButton} ${period === 'week' ? styles.active : ''}`}
          onClick={() => onPeriodChange('week')}
        >
          Week
        </button>
      </div>
    </div>
  );
};

export default PeriodSelector;

