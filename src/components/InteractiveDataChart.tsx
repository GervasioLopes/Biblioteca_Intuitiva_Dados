import React, { useState } from 'react';
import { ChartSimulationConfig, ChartPoint } from '../types/data-library';
import { Activity, Info, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

interface Props {
  config: ChartSimulationConfig;
  params: Record<string, any>;
}

export const InteractiveDataChart: React.FC<Props> = ({ config, params }) => {
  const [hoveredPoint, setHoveredPoint] = useState<ChartPoint | null>(null);
  const data = config.computeData(params);

  // SVG dimensions
  const width = 760;
  const height = 300;
  const padding = { top: 30, right: 35, bottom: 45, left: 60 };

  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  // Render different chart visualizers based on config.type
  const renderChart = () => {
    if (config.type === 'scatter-regression') {
      const xVals = data.points.map(p => typeof p.x === 'number' ? p.x : 0);
      const yVals = data.points.map(p => p.y);
      const minX = Math.min(0, ...xVals);
      const maxX = Math.max(...xVals) * 1.08;
      const minY = 0;
      const maxY = Math.max(...yVals) * 1.12;

      const scaleX = (x: number) => padding.left + ((x - minX) / (maxX - minX || 1)) * innerWidth;
      const scaleY = (y: number) => padding.top + innerHeight - ((y - minY) / (maxY - minY || 1)) * innerHeight;

      // Extract trend line points
      const trendPoints = data.points
        .filter(p => p.trend !== undefined)
        .sort((a, b) => Number(a.x) - Number(b.x));

      const linePath = trendPoints.length > 1
        ? `M ${scaleX(Number(trendPoints[0].x))} ${scaleY(trendPoints[0].trend!)} ` +
          trendPoints.slice(1).map(p => `L ${scaleX(Number(p.x))} ${scaleY(p.trend!)}`).join(' ')
        : '';

      return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
          {/* Grid lines */}
          {[0.25, 0.5, 0.75, 1.0].map((ratio, idx) => {
            const yVal = minY + (maxY - minY) * ratio;
            const yPos = scaleY(yVal);
            return (
              <g key={idx}>
                <line x1={padding.left} y1={yPos} x2={width - padding.right} y2={yPos} stroke="#334155" strokeDasharray="3 3" opacity="0.6" />
                <text x={padding.left - 10} y={yPos + 4} textAnchor="end" className="text-[11px] fill-slate-400 font-mono">
                  {Math.round(yVal)}k
                </text>
              </g>
            );
          })}

          {/* Trend Line */}
          {linePath && (
            <path
              d={linePath}
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2.5"
              strokeDasharray="none"
              className="drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]"
            />
          )}

          {/* Points */}
          {data.points.map((p, idx) => {
            const cx = scaleX(Number(p.x));
            const cy = scaleY(p.y);
            const isSelected = hoveredPoint?.label === p.label;
            const isProjection = p.isOutlier;

            return (
              <g
                key={idx}
                onMouseEnter={() => setHoveredPoint(p)}
                onMouseLeave={() => setHoveredPoint(null)}
                className="cursor-pointer transition-transform duration-200"
              >
                {isProjection && (
                  <circle cx={cx} cy={cy} r="14" fill="#a855f7" opacity="0.2" className="animate-pulse" />
                )}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isSelected ? 7 : isProjection ? 6 : 5}
                  fill={isProjection ? '#c084fc' : isSelected ? '#38bdf8' : '#60a5fa'}
                  stroke={isProjection ? '#f3e8ff' : '#0f172a'}
                  strokeWidth="2"
                  className="transition-all duration-150"
                />
                {isSelected && (
                  <text
                    x={cx}
                    y={cy - 12}
                    textAnchor="middle"
                    className="text-[11px] fill-cyan-300 font-medium bg-slate-900 px-1 py-0.5"
                  >
                    {p.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* Axis Labels */}
          <text x={width / 2} y={height - 8} textAnchor="middle" className="text-[11px] fill-slate-400 font-medium">
            {config.xAxisLabel}
          </text>
          <text
            x={15}
            y={height / 2}
            textAnchor="middle"
            transform={`rotate(-90 15 ${height / 2})`}
            className="text-[11px] fill-slate-400 font-medium"
          >
            {config.yAxisLabel}
          </text>
        </svg>
      );
    }

    if (config.type === 'distribution-histogram') {
      const points = data.points;
      const count = points.length;
      const barWidth = innerWidth / (count || 1);
      const maxVal = Math.max(...points.map(p => Math.abs(p.y)), 3.5);

      return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
          {/* Threshold Zone */}
          <line
            x1={padding.left}
            y1={padding.top + innerHeight / 2}
            x2={width - padding.right}
            y2={padding.top + innerHeight / 2}
            stroke="#64748b"
            strokeWidth="1.5"
          />

          {points.map((p, idx) => {
            const x = padding.left + idx * barWidth + barWidth * 0.15;
            const barW = barWidth * 0.7;
            const normalizedY = (p.y / maxVal) * (innerHeight / 2 - 20);
            const isPositive = p.y >= 0;
            const zeroY = padding.top + innerHeight / 2;
            const y = isPositive ? zeroY - normalizedY : zeroY;
            const barH = Math.max(4, Math.abs(normalizedY));
            const isOutlier = p.isOutlier;

            return (
              <g
                key={idx}
                onMouseEnter={() => setHoveredPoint(p)}
                onMouseLeave={() => setHoveredPoint(null)}
                className="cursor-pointer group"
              >
                <rect
                  x={x}
                  y={y}
                  width={barW}
                  height={barH}
                  rx="3"
                  fill={isOutlier ? '#f43f5e' : '#10b981'}
                  opacity={hoveredPoint?.label === p.label ? 1 : 0.85}
                  className="transition-all duration-200 hover:opacity-100"
                />
                <text
                  x={x + barW / 2}
                  y={height - padding.bottom + 16}
                  textAnchor="middle"
                  className="text-[10px] fill-slate-400 font-mono"
                >
                  {typeof p.x === 'string' ? p.x.slice(0, 7) : `R$${p.x}`}
                </text>
                <text
                  x={x + barW / 2}
                  y={isPositive ? y - 6 : y + barH + 12}
                  textAnchor="middle"
                  className={`text-[10px] font-mono font-semibold ${isOutlier ? 'fill-rose-400' : 'fill-emerald-400'}`}
                >
                  {p.y > 0 ? `+${p.y}` : p.y}
                </text>
              </g>
            );
          })}

          <text x={width / 2} y={height - 8} textAnchor="middle" className="text-[11px] fill-slate-400 font-medium">
            {config.xAxisLabel}
          </text>
          <text
            x={15}
            y={height / 2}
            textAnchor="middle"
            transform={`rotate(-90 15 ${height / 2})`}
            className="text-[11px] fill-slate-400 font-medium"
          >
            {config.yAxisLabel}
          </text>
        </svg>
      );
    }

    if (config.type === 'boxplot-comparison') {
      const points = data.points;
      const count = points.length;
      const step = innerWidth / count;
      const maxVal = Math.max(...points.map(p => p.y)) * 1.08;

      const scaleY = (val: number) => padding.top + innerHeight - (val / (maxVal || 1)) * innerHeight;
      const upper = points[0]?.upperBand || 25;
      const lower = points[0]?.lowerBand || 0;
      const upperY = scaleY(upper);

      return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
          {/* Tukey upper fence threshold line */}
          <line
            x1={padding.left}
            y1={upperY}
            x2={width - padding.right}
            y2={upperY}
            stroke="#f59e0b"
            strokeDasharray="4 4"
            strokeWidth="2"
          />
          <text x={width - padding.right - 5} y={upperY - 8} textAnchor="end" className="text-[11px] fill-amber-400 font-medium">
            Cerca Superior (Q3 + K*IQR) = R$ {upper.toFixed(1)}k
          </text>

          {/* Whiskers & Data Points */}
          {points.map((p, idx) => {
            const cx = padding.left + idx * step + step / 2;
            const cy = scaleY(p.y);
            const isOutlier = p.isOutlier;

            return (
              <g
                key={idx}
                onMouseEnter={() => setHoveredPoint(p)}
                onMouseLeave={() => setHoveredPoint(null)}
                className="cursor-pointer group"
              >
                {/* Stem line */}
                <line
                  x1={cx}
                  y1={scaleY(0)}
                  x2={cx}
                  y2={cy}
                  stroke="#475569"
                  strokeWidth="1.5"
                  strokeDasharray={isOutlier ? '3 3' : 'none'}
                />
                {/* Marker point */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isOutlier ? 8 : 6}
                  fill={isOutlier ? '#ef4444' : '#3b82f6'}
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="transition-all duration-200"
                />
                <text
                  x={cx}
                  y={height - padding.bottom + 16}
                  textAnchor="middle"
                  className="text-[10px] fill-slate-300 font-medium"
                >
                  {p.x}
                </text>
                <text
                  x={cx}
                  y={cy - 10}
                  textAnchor="middle"
                  className={`text-[11px] font-mono font-semibold ${isOutlier ? 'fill-rose-400 font-bold' : 'fill-blue-300'}`}
                >
                  {p.y}k
                </text>
              </g>
            );
          })}
        </svg>
      );
    }

    if (config.type === 'rfm-matrix') {
      const points = data.points;
      const maxX = 360;
      const maxY = 50000;

      const scaleX = (x: number) => padding.left + (x / maxX) * innerWidth;
      const scaleY = (y: number) => padding.top + innerHeight - (y / maxY) * innerHeight;

      return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
          {/* Quadrant lines */}
          <line
            x1={padding.left + innerWidth * 0.25}
            y1={padding.top}
            x2={padding.left + innerWidth * 0.25}
            y2={padding.top + innerHeight}
            stroke="#334155"
            strokeDasharray="4 4"
          />
          <line
            x1={padding.left}
            y1={padding.top + innerHeight * 0.55}
            x2={width - padding.right}
            y2={padding.top + innerHeight * 0.55}
            stroke="#334155"
            strokeDasharray="4 4"
          />

          {/* Zones labels */}
          <text x={padding.left + 15} y={padding.top + 20} className="text-[11px] fill-amber-400/70 font-semibold uppercase tracking-wider">
            👑 Clientes VIP (Alta Frequência / Recentes)
          </text>
          <text x={width - padding.right - 10} y={height - padding.bottom - 10} textAnchor="end" className="text-[11px] fill-slate-500 font-semibold uppercase tracking-wider">
            ❄️ Clientes Inativos / Baixo Valor
          </text>

          {/* Points */}
          {points.map((p, idx) => {
            const cx = scaleX(Number(p.x));
            const cy = scaleY(p.y);
            const radius = Math.max(6, Math.min(18, (p.size || 10) * 0.6));
            const isRisk = p.isOutlier;

            return (
              <g
                key={idx}
                onMouseEnter={() => setHoveredPoint(p)}
                onMouseLeave={() => setHoveredPoint(null)}
                className="cursor-pointer group"
              >
                <circle
                  cx={cx}
                  cy={cy}
                  r={radius}
                  fill={isRisk ? '#f59e0b' : p.category?.includes('VIP') ? '#10b981' : '#6366f1'}
                  opacity={hoveredPoint?.label === p.label ? 1 : 0.75}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
                <text
                  x={cx}
                  y={cy - radius - 4}
                  textAnchor="middle"
                  className="text-[10px] fill-slate-200 font-medium"
                >
                  {p.label?.split(':')[0]}
                </text>
              </g>
            );
          })}

          <text x={width / 2} y={height - 8} textAnchor="middle" className="text-[11px] fill-slate-400 font-medium">
            {config.xAxisLabel}
          </text>
          <text
            x={15}
            y={height / 2}
            textAnchor="middle"
            transform={`rotate(-90 15 ${height / 2})`}
            className="text-[11px] fill-slate-400 font-medium"
          >
            {config.yAxisLabel}
          </text>
        </svg>
      );
    }

    return null;
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-xl backdrop-blur-sm">
      {/* Header and Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-slate-800/80 gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              {config.title}
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                Live SVG Engine
              </span>
            </h4>
            <p className="text-xs text-slate-400">{config.subtitle}</p>
          </div>
        </div>

        {/* Real-time metrics strip */}
        <div className="flex flex-wrap items-center gap-2">
          {data.metrics.map((m, i) => (
            <div key={i} className="bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1 text-right">
              <span className="block text-[10px] text-slate-400 font-mono uppercase">{m.label}</span>
              <span className="text-xs font-semibold font-mono text-cyan-300">{m.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full bg-slate-950/60 rounded-lg p-2 border border-slate-800/50">
        {renderChart()}

        {/* Hover inspect tooltip */}
        {hoveredPoint && (
          <div className="absolute top-3 right-3 bg-slate-900/95 border border-cyan-500/40 rounded-lg px-3 py-2 text-xs shadow-2xl backdrop-blur-md pointer-events-none animate-fadeIn">
            <div className="flex items-center gap-1.5 text-cyan-400 font-semibold mb-1">
              <Info className="w-3.5 h-3.5" />
              <span>Inspeção de Ponto</span>
            </div>
            <p className="text-slate-200 font-mono text-[11px]">{hoveredPoint.label}</p>
            {hoveredPoint.category && (
              <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
                Segmento: {hoveredPoint.category}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Highlights & Natural Language Conclusion */}
      {data.highlightNotes && data.highlightNotes.length > 0 && (
        <div className="mt-3.5 pt-3 border-t border-slate-800/70 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 gap-2">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="space-y-0.5">
              {data.highlightNotes.map((note, idx) => (
                <p key={idx} className="text-slate-300">{note}</p>
              ))}
            </div>
          </div>
          <div className="text-[11px] font-mono text-slate-500 shrink-0">
            Reativo aos parâmetros ajustáveis
          </div>
        </div>
      )}
    </div>
  );
};
