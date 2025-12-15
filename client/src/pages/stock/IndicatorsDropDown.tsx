import { useState, useRef, useEffect } from "react";

const indicators: Record<string, string> = {
  SMA: "Simple Moving Average",
  EMA: "Exponential Moving Average",
  DEMA: "Double Exponential Moving Average",
  TEMA: "Triple Exponential Moving Average",

  TYP: "Typical Price",
  VWMA: "Volume Weighted Moving Average",

  TRIX: "Triple Exponential Oscillator",
  APO: "Absolute Price Oscillator",
  BOP: "Balance of Power",

  ROC: "Rate of Change",
  RSI: "Relative Strength Index",

  AB: "Acceleration Bands",
  ATR: "Average True Range",
  BBW: "Bollinger Bands Width",
  TR: "True Range",
  UI: "Ulcer Index",

  EMV: "Ease of Movement",
  FI: "Force Index",
  MFI: "Money Flow Index",
  NVI: "Negative Volume Index",
  OBV: "On Balance Volume",
  VPT: "Volume Price Trend",
};


type Props = {
  onSelect: (indicator: string | null) => void;
};

const IndicatorsDropdown = ({ onSelect }: Props) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = Object.entries(indicators).filter(([_, label]) =>
    label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div ref={dropdownRef} className="relative w-56">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-[#070d2d] border border-[#1e2a6b] rounded-lg px-3 py-2 text-sm text-gray-200"
      >
        {selected ? indicators[selected] : "Select Indicator"}
      </button>

      {isOpen && (
        <div className="absolute mt-2 w-full bg-[#070d2d] border border-[#1e2a6b] rounded-lg max-h-60 overflow-y-auto z-50">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="w-full bg-transparent border-b border-[#1e2a6b] px-3 py-2 text-sm outline-none"
          />

          <div
            onClick={() => {
              setSelected(null);
              onSelect(null);
              setIsOpen(false);
            }}
            className="px-3 py-2 text-sm text-gray-400 hover:bg-[#0b123a] cursor-pointer"
          >
            None
          </div>

          {filtered.map(([key, label]) => (
            <div
              key={key}
              onClick={() => {
                setSelected(key);
                onSelect(key);
                setIsOpen(false);
              }}
              className="px-3 py-2 text-sm hover:bg-[#0b123a] cursor-pointer"
            >
              {label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IndicatorsDropdown;