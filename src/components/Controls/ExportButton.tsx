import React from 'react';
import { exportChartToPNG } from '../../utils/chartUtils';
import styles from './Controls.module.css';

interface ExportButtonProps {
  chartRef: React.RefObject<HTMLDivElement>;
}

const ExportButton: React.FC<ExportButtonProps> = ({ chartRef }) => {
  const handleExport = async () => {
    if (chartRef.current) {
      try {
        await exportChartToPNG(chartRef.current, 'ab-test-chart.png');
      } catch (error) {
        alert('Failed to export chart. Please try again.');
      }
    }
  };

  return (
    <button className={styles.exportButton} onClick={handleExport} title="Export to PNG">
      📥 Export PNG
    </button>
  );
};

export default ExportButton;

