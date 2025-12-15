



import { useEffect, useRef } from "react";
import {
  createChart,
  LineSeries,
  type UTCTimestamp,
  type IChartApi,
  type ISeriesApi,
} from "lightweight-charts";

type Props = {
  data: { time: UTCTimestamp; value: number }[];
  height?: number;
  onChartReady?: (chart: IChartApi) => void;
};

const PANEL_STYLE = {
  autoSize: true,
  layout: {
    background: { color: "#000000" },
    textColor: "#e0e0e0",
  },
  grid: {
    vertLines: { color: "rgba(255,255,255,0.06)" },
    horzLines: { color: "rgba(255,255,255,0.06)" },
  },
  rightPriceScale: { borderVisible: false },
  timeScale: { borderVisible: false },
};

export default function SubIndicatorPanel({
  data,
  height = 180,
  onChartReady,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Line"> | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    if (!chartRef.current) {
      const chart = createChart(containerRef.current, PANEL_STYLE);
      seriesRef.current = chart.addSeries(LineSeries, {
        lineWidth: 2,
        color: "#FFD54F",
      });
      chartRef.current = chart;
      onChartReady?.(chart);
    }

    seriesRef.current?.setData(data);
  }, [data, onChartReady]);

  return <div ref={containerRef} style={{ height }} className="w-full" />;
}
