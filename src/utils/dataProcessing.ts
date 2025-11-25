import { RawData, ChartDataPoint, ProcessedVariation } from '../types';
import { groupByWeek } from './dateUtils';

const VARIATION_COLORS = ['#000000', '#3B82F6', '#F97316', '#8B5CF6', '#10B981'];

export function getVariationKey(variation: { id?: number; name: string }): string {
  return variation.id?.toString() || '0';
}

export function calculateConversionRate(conversions: number, visits: number): number {
  if (visits === 0) return 0;
  return (conversions / visits) * 100;
}

export interface ExtendedDataPoint {
  date: string;
  [variationKey: string]: string | number | Record<string, number> | undefined;
  _visits?: Record<string, number>;
  _conversions?: Record<string, number>;
}

export function processRawData(rawData: RawData): {
  variations: ProcessedVariation[];
  dailyData: ExtendedDataPoint[];
} {
  const variations: ProcessedVariation[] = rawData.variations.map((variation, index) => ({
    id: getVariationKey(variation),
    name: variation.name,
    color: VARIATION_COLORS[index % VARIATION_COLORS.length],
  }));

  const dailyData: ExtendedDataPoint[] = rawData.data.map((dataPoint) => {
    const chartPoint: ExtendedDataPoint = {
      date: dataPoint.date,
      _visits: dataPoint.visits,
      _conversions: dataPoint.conversions,
    };

    variations.forEach((variation) => {
      const visits = dataPoint.visits[variation.id] || 0;
      const conversions = dataPoint.conversions[variation.id] || 0;
      const conversionRate = calculateConversionRate(conversions, visits);
      chartPoint[variation.id] = conversionRate;
    });

    return chartPoint;
  });

  return { variations, dailyData };
}

export function aggregateByWeek(
  dailyData: ExtendedDataPoint[],
  variations: ProcessedVariation[]
): ChartDataPoint[] {
  const weekGroups = groupByWeek(dailyData);
  const weeklyData: ChartDataPoint[] = [];

  weekGroups.forEach((week) => {
    const weekDailyPoints = dailyData.filter(
      (point) => point.date >= week.weekStart && point.date <= week.weekEnd
    );

    if (weekDailyPoints.length === 0) return;

    const weeklyPoint: ChartDataPoint = {
      date: week.date,
    };

    variations.forEach((variation) => {
      let totalVisits = 0;
      let totalConversions = 0;

      weekDailyPoints.forEach((dailyPoint) => {
        const visits = dailyPoint._visits?.[variation.id] || 0;
        const conversions = dailyPoint._conversions?.[variation.id] || 0;
        totalVisits += visits;
        totalConversions += conversions;
      });

      const conversionRate = calculateConversionRate(totalConversions, totalVisits);
      weeklyPoint[variation.id] = conversionRate;
    });

    weeklyData.push(weeklyPoint);
  });

  return weeklyData;
}

export function filterDataByVariations(
  data: ChartDataPoint[],
  selectedVariationIds: string[]
): ChartDataPoint[] {
  return data.map((point) => {
    const filteredPoint: ChartDataPoint = { date: point.date };
    selectedVariationIds.forEach((id) => {
      filteredPoint[id] = point[id] || 0;
    });
    return filteredPoint;
  });
}

export function getDataRange(data: ChartDataPoint[], variationIds: string[]): {
  minX: string;
  maxX: string;
  minY: number;
  maxY: number;
} {
  if (data.length === 0) {
    return { minX: '', maxX: '', minY: 0, maxY: 40 };
  }

  let minY = Infinity;
  let maxY = -Infinity;

  data.forEach((point) => {
    variationIds.forEach((id) => {
      const value = (point[id] as number) || 0;
      if (value < minY) minY = value;
      if (value > maxY) maxY = value;
    });
  });

  // Add padding to Y axis
  const padding = (maxY - minY) * 0.1 || 5;
  minY = Math.max(0, minY - padding);
  maxY = maxY + padding;

  // Round to nice numbers
  maxY = Math.ceil(maxY / 5) * 5;
  minY = Math.floor(minY / 5) * 5;

  return {
    minX: data[0].date,
    maxX: data[data.length - 1].date,
    minY,
    maxY,
  };
}

