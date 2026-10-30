export type AnalyticalCategory = 
  | 'descritiva'
  | 'segmentacao'
  | 'anomalias'
  | 'preditiva'
  | 'limpeza';

export interface CategoryInfo {
  id: AnalyticalCategory;
  name: string;
  iconName: string;
  shortDesc: string;
  color: string;
  gradient: string;
  tagColor: string;
}

export type SkillLevel = 'Iniciante' | 'Intermediário' | 'Avançado';

export interface ColumnMeta {
  key: string;
  label: string;
  type: 'int64' | 'float64' | 'object' | 'bool' | 'datetime64';
  description?: string;
}

export interface InteractiveParameter {
  id: string;
  label: string;
  type: 'slider' | 'select' | 'boolean';
  min?: number;
  max?: number;
  step?: number;
  defaultValue: any;
  options?: { value: string | number; label: string }[];
  description: string;
  unit?: string;
}

export interface ConceptualArticle {
  headline: string;
  oneLiner: string;
  coreIntuition: string[];
  analogy: string;
  whenToUse: string[];
  whenToAvoid: string[];
  businessValue: string;
  pandasPitfalls: string[];
  performanceNotes: {
    timeComplexity: string;
    memoryComplexity: string;
    vectorized: boolean;
  };
}

export interface MiniDataset {
  name: string;
  description: string;
  columns: ColumnMeta[];
  rawRows: Record<string, any>[];
}

export interface ChartPoint {
  x: number | string;
  y: number;
  label?: string;
  category?: string;
  isOutlier?: boolean;
  cluster?: number;
  trend?: number;
  upperBand?: number;
  lowerBand?: number;
  [key: string]: any;
}

export interface ChartSimulationConfig {
  type: 'scatter-regression' | 'distribution-histogram' | 'boxplot-comparison' | 'time-series-anomaly' | 'cluster-clusters' | 'rfm-matrix';
  title: string;
  subtitle: string;
  xAxisLabel: string;
  yAxisLabel: string;
  metrics: { label: string; value: string | number; helper?: string }[];
  computeData: (params: Record<string, any>) => {
    points: ChartPoint[];
    metrics: { label: string; value: string | number; helper?: string }[];
    highlightNotes?: string[];
  };
}

export interface AlgorithmItem {
  id: string;
  title: string;
  category: AnalyticalCategory;
  level: SkillLevel;
  badge: string;
  shortObjective: string;
  tags: string[];
  pythonCode: string;
  dataset: MiniDataset;
  parameters: InteractiveParameter[];
  processDataset: (raw: Record<string, any>[], params: Record<string, any>) => Record<string, any>[];
  article: ConceptualArticle;
  chart: ChartSimulationConfig;
}
