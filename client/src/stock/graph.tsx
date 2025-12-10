// import { useState, useEffect, useRef } from "react"
// import {
//   AreaSeries, LineSeries, CandlestickSeries, createChart,
//   type AreaSeriesOptions, type CandlestickSeriesOptions,
//   type ChartOptions, type DeepPartial, type IChartApi,
//   type ISeriesApi, type UTCTimestamp
// } from "lightweight-charts"

// // Indicators
// import { sma, ema, dema, tema, trix, rma, mmax } from "indicatorts"

// import IndicatorsDropdown from "./indicatorsdropdown"

// type StockEntry = {
//   time: UTCTimestamp
//   open: number
//   close: number
//   high: number
//   low: number
// }
// const INDICATOR_STYLE:any = { lineWidth:2, color:"#ffd54f" }
// const Graph = ({ data }: { data: StockEntry[] }) => {

//   const [selectedIndicator, setSelectedIndicator] = useState<string | null>(null)

//   // Chart Refs
//   const finChartRef = useRef<IChartApi | null>(null)
//   const lineChartRef = useRef<IChartApi | null>(null)
//   const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null)
//   const priceLineRef = useRef<ISeriesApi<"Area"> | null>(null)
//   const overlayRef = useRef<ISeriesApi<"Line"> | null>(null)

//   const [showCandle, setShowCandle] = useState(true)

//   // INIT CHART
//   useEffect(() => {
//     if (!finChartRef.current) {
//       const fin = createChart(document.getElementById("candle-chart")!, CHART_MAIN)
//       candleSeriesRef.current = fin.addSeries(CandlestickSeries, CANDLE_STYLE)
//       candleSeriesRef.current.setData(data)
//       finChartRef.current = fin
//     }

//     if (!lineChartRef.current) {
//       const line = createChart(document.getElementById("line-chart")!, CHART_MAIN)
//       priceLineRef.current = line.addSeries(AreaSeries, PRICE_STYLE)
//       priceLineRef.current.setData(data.map(d => ({ time: d.time, value: d.close })))
//       lineChartRef.current = line
//     }

//   }, [])

//   // APPLY INDICATOR
//   useEffect(() => {
//     if (!selectedIndicator || !data.length) {
//       overlayRef.current?.setData([]) // 🚫 no indicator → clear
//       return
//     }

//     const close = data.map(v => v.close)
//     const t = data.map(v => v.time)
//     let out: any[] = []

//     switch (selectedIndicator) {
//       case "SMA": out = sma(close, { period: 14 }); break
//       case "EMA": out = ema(close, { period: 14 }); break
//       case "DEMA": out = dema(close, { period: 14 }); break
//       case "TEMA": out = tema(close, { period: 14 }); break
//       case "TRIX": out = trix(close, { period: 14 }); break
//       case "RMA": out = rma(close, { period: 14 }); break
//       case "MMAX": out = mmax(close, { period: 14 }); break
//     }

//     const formatted:any = out.map((v, i) => v ? { time: t[i], value: v } : null).filter(Boolean)

//     if (!overlayRef.current && finChartRef.current)
//       overlayRef.current = finChartRef.current.addSeries(LineSeries, INDICATOR_STYLE)

//     overlayRef.current?.setData(formatted)

//     if (!overlayRef.current && lineChartRef.current)
//       overlayRef.current = lineChartRef.current.addSeries(LineSeries, INDICATOR_STYLE)

//   }, [selectedIndicator, data])

//   return (
//     <div className="relative text-white w-full">

//       {/* 🎛 Top control panel — smooth & clean */}
//       <div className="absolute top-3 left-4 z-50 flex gap-4 bg-[#0f0f0f]/80 px-4 py-2 rounded-xl border border-gray-700 backdrop-blur-md shadow-lg">
        
//         {/* View Switch */}
//         <div className="flex bg-[#1a1a1a] rounded-md overflow-hidden border border-gray-600">
//           <button onClick={() => setShowCandle(true)}
//             className={`px-3 py-1 ${showCandle ? "bg-blue-600" : ""}`}>
//             Candle
//           </button>
//           <button onClick={() => setShowCandle(false)}
//             className={`px-3 py-1 ${!showCandle ? "bg-blue-600" : ""}`}>
//             Line
//           </button>
//         </div>

//         {/* Indicator Dropdown */}
//         <IndicatorsDropdown onSelect={(x)=> setSelectedIndicator(x)}/>
//       </div>

//       <div id="candle-chart" className={`w-full h-[80vh] ${showCandle ? "" : "hidden"}`}></div>
//       <div id="line-chart" className={`w-full h-[80vh] ${!showCandle ? "" : "hidden"}`}></div>

//     </div>
//   )
// }

// /* --- Chart Styling --- */
// const CHART_MAIN: DeepPartial<ChartOptions> = {
//   autoSize: true,
//   layout: { background: { color: "#000" }, textColor: "#e0e0e0" },
//   grid: { vertLines:{color:"#222"}, horzLines:{color:"#222"} }
// }
// const CANDLE_STYLE: DeepPartial<CandlestickSeriesOptions> = {
//   upColor:"#26a69a", downColor:"#ef5350",
//   borderVisible:false, wickUpColor:"#26a69a", wickDownColor:"#ef5350"
// }
// const PRICE_STYLE: DeepPartial<AreaSeriesOptions> = {
//   lineColor:"#4F9BFF", topColor:"#4F9BFF88", bottomColor:"#4F9BFF11", lineWidth:2
// }


// export default Graph
import { useState, useEffect, useRef } from "react";
import {
  AreaSeries,LineSeries,CandlestickSeries,createChart,type AreaSeriesOptions,
  type CandlestickSeriesOptions,type ChartOptions,type DeepPartial,
  type IChartApi,type ISeriesApi,type UTCTimestamp,
} from "lightweight-charts";

import IndicatorsDropdown from "./IndicatorsDropdown";
import { computeIndicator } from "./indicatorCalculator";
type StockEntry = {
  time: UTCTimestamp; open: number;high: number;
  low: number; close: number; volume?: number;
};
type GraphProps = {
  data: StockEntry[];curr: string;
  indicatorData: { name: string; values: number[] } | null;
};
const INDICATOR_STYLE: any = { lineWidth: 2, color: "#ffd54f" };
const Graph = ({ data, curr, indicatorData }: GraphProps) => {
  const [selectedIndicator, setSelectedIndicator] = useState<string | null>(null);
  useEffect(() => {
    if (indicatorData) setSelectedIndicator(indicatorData.name);
  }, [indicatorData]);

  const finChartRef = useRef<IChartApi | null>(null);
  const lineChartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const priceLineRef = useRef<ISeriesApi<"Area"> | null>(null);
  const candleOverlayRef = useRef<ISeriesApi<"Line"> | null>(null);
  const lineOverlayRef = useRef<ISeriesApi<"Line"> | null>(null);

  const [showCandle, setShowCandle] = useState(true);

  useEffect(() => {
    if (!finChartRef.current && data.length) {
      const fin = createChart(
        document.getElementById("candle-chart")!,
        CHART_MAIN
      );
      candleSeriesRef.current = fin.addSeries(CandlestickSeries, CANDLE_STYLE);
      candleSeriesRef.current.setData(data);
      finChartRef.current = fin;
    }

    if (!lineChartRef.current && data.length) {
      const line = createChart(
        document.getElementById("line-chart")!,
        CHART_MAIN
      );
      priceLineRef.current = line.addSeries(AreaSeries, PRICE_STYLE);
      priceLineRef.current.setData(
        data.map(d => ({ time: d.time, value: d.close }))
      );
      lineChartRef.current = line;
    }
  }, [data]);

  useEffect(() => {
    if (!data.length) return;
    if (!selectedIndicator) {
      candleOverlayRef.current?.setData([]);
      lineOverlayRef.current?.setData([]);
      return;
    }
    const close = data.map(v => v.close);
    const open = data.map(v => v.open);
    const high = data.map(v => v.high);
    const low = data.map(v => v.low);
    const volumeData = data.map(v => v.volume || 1000);
    const t = data.map(v => v.time);
    const out = computeIndicator(selectedIndicator, {
      open,
      high,
      low,
      close,
      volume: volumeData,
    });
    const formatted: { time: UTCTimestamp; value: number }[] = out
      .map((v, i) => {
        if (isNaN(v) || !isFinite(v)) return null;
        return { time: t[i], value: v };
      })
      .filter(
        (item): item is { time: UTCTimestamp; value: number } => item !== null
      );
    if (finChartRef.current && !candleOverlayRef.current) {
      candleOverlayRef.current = finChartRef.current.addSeries(
        LineSeries,
        INDICATOR_STYLE
      );
    }

    if (lineChartRef.current && !lineOverlayRef.current) {
      lineOverlayRef.current = lineChartRef.current.addSeries(
        LineSeries,
        INDICATOR_STYLE
      );
    }
    candleOverlayRef.current?.setData(formatted);
    lineOverlayRef.current?.setData(formatted);
  }, [selectedIndicator, data]);

  return (
    <div className="relative text-white w-full">
      <div className="absolute top-3 left-4 z-50 flex gap-4 bg-[#0f0f0f]/80 px-4 py-2 rounded-xl border border-gray-700 backdrop-blur-md shadow-lg">
        <div className="flex bg-[#1a1a1a] rounded-md overflow-hidden border border-gray-600">
          <button
            onClick={() => setShowCandle(true)}
        className={`px-3 py-1 ${showCandle ? "bg-blue-600" : ""}`}
          >
          Candle
          </button>
          <button
            onClick={() => setShowCandle(false)} className={`px-3 py-1 ${!showCandle ? "bg-blue-600" : ""}`}
          >
            Line
          </button>
        </div>
          <IndicatorsDropdown onSelect={x => setSelectedIndicator(x)} />
        </div>

      <div
        id="candle-chart"
        className={`w-full h-[80vh] ${showCandle ? "" : "hidden"}`}
      ></div>
      <div
        id="line-chart"
        className={`w-full h-[80vh] ${!showCandle ? "" : "hidden"}`}
      ></div>
    </div>
  );
};
const CHART_MAIN: DeepPartial<ChartOptions> = {
  autoSize: true,
  layout: { background: { color: "#000" }, textColor: "#e0e0e0" },
  grid: { vertLines: { color: "#222" }, horzLines: { color: "#222" } },
};

const CANDLE_STYLE: DeepPartial<CandlestickSeriesOptions> = {
  upColor: "#26a69a",downColor: "#ef5350",borderVisible: false,wickUpColor: "#26a69a",wickDownColor: "#ef5350",
};

const PRICE_STYLE: DeepPartial<AreaSeriesOptions> = {
  lineColor: "#4F9BFF",topColor: "#4F9BFF88",bottomColor: "#4F9BFF11",lineWidth: 2,
};

export default Graph;