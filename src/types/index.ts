export interface Variation {
  id?: number;
  name: string;
}

export interface RawDataPoint {
  date: string;
  visits: Record<string, number>;
  conversions: Record<string, number>;
}

export interface RawData {
  variations: Variation[];
  data: RawDataPoint[];
}

export interface ChartDataPoint {
  date: string;
  [variationKey: string]: string | number | undefined;
}

export interface ProcessedVariation {
  id: string;
  name: string;
  color: string;
}

export type Period = 'day' | 'week';

export type LineStyle = 'line' | 'smooth' | 'area';

export type Theme = 'light' | 'dark';

