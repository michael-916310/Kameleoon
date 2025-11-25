import React, { useRef } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { ChartDataPoint, ProcessedVariation, LineStyle, Period } from '../../types';
import CustomTooltip from '../Tooltip/CustomTooltip';
import { formatDateShort } from '../../utils/dateUtils';
import styles from './Chart.module.css';

interface ChartProps {
  data: ChartDataPoint[];
  variations: ProcessedVariation[];
  lineStyle: LineStyle;
  period: Period;
  dataRange: {
    minX: string;
    maxX: string;
    minY: number;
    maxY: number;
  };
  onHover?: (activeIndex: number | null) => void;
  activeIndex: number | null;
  zoomDomain?: [number, number];
}

const Chart: React.FC<ChartProps> = ({
  data,
  variations,
  lineStyle,
  period,
  dataRange,
  onHover,
  activeIndex,
  zoomDomain,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);

  const renderLine = (variation: ProcessedVariation) => {
    const commonProps = {
      key: variation.id,
      dataKey: variation.id,
      stroke: variation.color,
      strokeWidth: 2,
      dot: false,
      activeDot: { r: 4 },
      connectNulls: true,
    };

    if (lineStyle === 'smooth') {
      return <Line {...commonProps} type="monotone" />;
    }

    if (lineStyle === 'area') {
      return (
        <Line
          {...commonProps}
          type="monotone"
          fill={variation.color}
          fillOpacity={0.1}
        />
      );
    }

    return <Line {...commonProps} type="linear" />;
  };

  const formatXAxis = (tickItem: string) => {
    return formatDateShort(tickItem);
  };

  const formatYAxis = (tickItem: number) => {
    return `${tickItem}%`;
  };

  return (
    <div ref={chartRef} className={styles.chartContainer}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          onMouseMove={(state) => {
            if (state && state.activeTooltipIndex !== undefined) {
              onHover?.(state.activeTooltipIndex);
            }
          }}
          onMouseLeave={() => onHover?.(null)}
        >
          <CartesianGrid strokeDasharray="3 3" className={styles.grid} />
          <XAxis
            dataKey="date"
            tickFormatter={formatXAxis}
            domain={
              zoomDomain && data[zoomDomain[0]] && data[zoomDomain[1]]
                ? [data[zoomDomain[0]].date, data[zoomDomain[1]].date]
                : ['dataMin', 'dataMax']
            }
            className={styles.axis}
          />
          <YAxis
            domain={[dataRange.minY, dataRange.maxY]}
            tickFormatter={formatYAxis}
            className={styles.axis}
          />
          <Tooltip
            content={<CustomTooltip variations={variations} period={period} />}
            cursor={{ stroke: '#666', strokeWidth: 1, strokeDasharray: '5 5' }}
          />
          {activeIndex !== null && data[activeIndex] && (
            <ReferenceLine
              x={data[activeIndex].date}
              stroke="#666"
              strokeWidth={1}
              strokeDasharray="5 5"
            />
          )}
          {variations.map(renderLine)}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;

