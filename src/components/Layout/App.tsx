import React, { useState, useRef } from 'react';
import { useChartData } from '../../hooks/useChartData';
import { useTheme } from '../../hooks/useTheme';
import { Period, LineStyle } from '../../types';
import Chart from '../Chart/Chart';
import VariationsSelector from '../Controls/VariationsSelector';
import PeriodSelector from '../Controls/PeriodSelector';
import LineStyleSelector from '../Controls/LineStyleSelector';
import ZoomControls from '../Controls/ZoomControls';
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
  const [zoomDomain, setZoomDomain] = useState<[number, number] | undefined>(undefined);
  const chartRef = useRef<HTMLDivElement>(null);

  const { variations, chartData, dataRange } = useChartData(selectedVariationIds, period);

  const handleZoomIn = () => {
    if (chartData.length === 0) return;
    const currentStart = zoomDomain ? zoomDomain[0] : 0;
    const currentEnd = zoomDomain ? zoomDomain[1] : chartData.length - 1;
    const range = currentEnd - currentStart;
    const newRange = Math.max(5, Math.floor(range * 0.7));
    const center = Math.floor((currentStart + currentEnd) / 2);
    const newStart = Math.max(0, center - Math.floor(newRange / 2));
    const newEnd = Math.min(chartData.length - 1, newStart + newRange);
    setZoomDomain([newStart, newEnd]);
  };

  const handleZoomOut = () => {
    if (chartData.length === 0) return;
    const currentStart = zoomDomain ? zoomDomain[0] : 0;
    const currentEnd = zoomDomain ? zoomDomain[1] : chartData.length - 1;
    const range = currentEnd - currentStart;
    const newRange = Math.min(chartData.length, Math.ceil(range * 1.4));
    const center = Math.floor((currentStart + currentEnd) / 2);
    const newStart = Math.max(0, center - Math.floor(newRange / 2));
    const newEnd = Math.min(chartData.length - 1, newStart + newRange);
    
    if (newStart === 0 && newEnd === chartData.length - 1) {
      setZoomDomain(undefined);
    } else {
      setZoomDomain([newStart, newEnd]);
    }
  };

  const handleResetZoom = () => {
    setZoomDomain(undefined);
  };

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
            <ZoomControls
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              onReset={handleResetZoom}
              canZoomIn={zoomDomain !== undefined}
              canZoomOut={true}
            />
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
            zoomDomain={zoomDomain}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
