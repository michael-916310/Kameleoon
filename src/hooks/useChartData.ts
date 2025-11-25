import { useMemo } from 'react';
import rawData from '../../data.json';
import {
  processRawData,
  aggregateByWeek,
  filterDataByVariations,
  getDataRange,
  ExtendedDataPoint,
} from '../utils/dataProcessing';
import { RawData, ChartDataPoint, ProcessedVariation, Period } from '../types';

export function useChartData(
  selectedVariationIds: string[],
  period: Period
): {
  variations: ProcessedVariation[];
  chartData: ChartDataPoint[];
  dataRange: {
    minX: string;
    maxX: string;
    minY: number;
    maxY: number;
  };
} {
  const { variations, dailyData } = useMemo(() => {
    return processRawData(rawData as RawData);
  }, []);

  const chartData = useMemo(() => {
    let data: ChartDataPoint[] = dailyData.map((point) => {
      const { _visits, _conversions, ...rest } = point as ExtendedDataPoint;
      return rest as ChartDataPoint;
    });

    if (period === 'week') {
      data = aggregateByWeek(dailyData as ExtendedDataPoint[], variations);
    }

    return filterDataByVariations(data, selectedVariationIds);
  }, [dailyData, variations, selectedVariationIds, period]);

  const dataRange = useMemo(() => {
    return getDataRange(chartData, selectedVariationIds);
  }, [chartData, selectedVariationIds]);

  return {
    variations: variations.filter((v) => selectedVariationIds.includes(v.id)),
    chartData,
    dataRange,
  };
}

