import React from 'react';
import { TooltipProps } from 'recharts';
import { ChartDataPoint, ProcessedVariation, Period } from '../../types';
import { formatDate } from '../../utils/dateUtils';
import styles from './CustomTooltip.module.css';

interface CustomTooltipProps extends TooltipProps<number, string> {
  variations: ProcessedVariation[];
  period: Period;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
  variations,
  period,
}) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const data = payload[0].payload as ChartDataPoint;
  const values = variations
    .map((variation) => {
      const value = (data[variation.id] as number) || 0;
      return { variation, value };
    })
    .sort((a, b) => b.value - a.value);

  const bestVariation = values[0];

  return (
    <div className={styles.tooltip}>
      <div className={styles.tooltipDate}>
        <span className={styles.calendarIcon}>📅</span>
        {formatDate(label as string, period)}
      </div>
      <div className={styles.tooltipContent}>
        {values.map(({ variation, value }) => (
          <div key={variation.id} className={styles.tooltipItem}>
            <div className={styles.tooltipItemHeader}>
              <span
                className={styles.colorDot}
                style={{ backgroundColor: variation.color }}
              />
              <span className={styles.variationName}>{variation.name}</span>
              {variation.id === bestVariation.variation.id && (
                <span className={styles.trophyIcon}>🏆</span>
              )}
            </div>
            <span className={styles.tooltipValue}>
              {value.toFixed(2).replace('.', ',')}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomTooltip;

