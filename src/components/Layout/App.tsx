import React, { useState, useRef } from 'react';
import { useChartData } from '../../hooks/useChartData';
import { useTheme } from '../../hooks/useTheme';
import { Period, LineStyle } from '../../types';
import Chart from '../Chart/Chart';
import VariationsSelector from '../Controls/VariationsSelector';
import PeriodSelector from '../Controls/PeriodSelector';
import LineStyleSelector from '../Controls/LineStyleSelector';
import ThemeToggle from '../Controls/ThemeToggle';
import ExportButton from '../Controls/ExportButton';
import rawData from '../../data.json';
import { processRawData } from '../../utils/dataProcessing';
import styles from './App.module.css';

const App: React.FC = () => {
  const { variations: allVariations } = processRawData(rawData as any);
  const [selectedVariationIds, setSelectedVariationIds] = useState<string[]>(
    allVariations.map((v) => v.id)
  );
  const [period, setPeriod] = useState<Period>('day');
  const [lineStyle, setLineStyle] = useState<LineStyle>('line');
  const [theme, setTheme] = useTheme();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  const { variations, chartData, dataRange } = useChartData(selectedVariationIds, period);

  return (
    <div className={styles.app} data-theme={theme}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Group 13998</h1>
        </header>

        <div className={styles.controls}>
          <VariationsSelector
            variations={allVariations}
            selectedIds={selectedVariationIds}
            onSelectionChange={setSelectedVariationIds}
          />
          <PeriodSelector period={period} onPeriodChange={setPeriod} />
          <LineStyleSelector lineStyle={lineStyle} onLineStyleChange={setLineStyle} />
          <div className={styles.rightControls}>
            <ThemeToggle theme={theme} onThemeChange={setTheme} />
            <ExportButton chartRef={chartRef} />
          </div>
        </div>

        <div className={styles.chartWrapper} ref={chartRef}>
          <Chart
            data={chartData}
            variations={variations}
            lineStyle={lineStyle}
            period={period}
            dataRange={dataRange}
            onHover={setActiveIndex}
            activeIndex={activeIndex}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
