import { useState } from "react";
import { makeRequest, showMessage, getBuyPrice, getSellPrice } from "../../lib/utils";
import { useUserStore } from "../../lib/store";

type Props = {
  stockId: string;
  stockName: string;
  price: number;
};

const Transact = ({ stockId, stockName, price }: Props) => {
  const userStore = useUserStore((state) => state);

  const [units, setUnits] = useState(1);
  const [isBuy, setIsBuy] = useState(true);
  const [loading, setLoading] = useState(false);

  const owned = userStore.stocks[stockId].quantity || 0;

  const buyPrice = getBuyPrice(price, units);
  const sellPrice = getSellPrice(price, units);

  const transact = async () => {
    if (units < 1 || isNaN(units)) {
      showMessage("Enter a valid number of units", true);
      return;
    }

    if (units > 100) {
      showMessage("Cannot transact more than 100 units at once", true);
      return;
    }

    setLoading(true);
    try {
      const res = await makeRequest(
        `stocks/transact/${stockId}`,
        "POST",
        { units: units * (isBuy ? 1 : -1) },
        true
      );

      if (res?.detail) {
        showMessage(res.detail.message, true);
      } else {
        showMessage(res.message);
        userStore.update(res.balance, {
          ...userStore.stocks,
          [stockId]: {
            quantity: (userStore.stocks[stockId].quantity || 0) + (isBuy ? units : -units),
            avg_price: res.avg_price
          }
        });
      }
    } catch {
      showMessage("Transaction failed", true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">
        Trade {stockName}
      </h3>

      <div className="text-sm text-gray-300 mb-4">
        <div>Balance: ₹{userStore.balance.toFixed(2)}</div>
        <div>Owned: {owned}</div>
      </div>

      {/* BUY / SELL TOGGLE */}
      <div className="flex mb-4 rounded-lg bg-[#0b123a] border border-[#1e2a6b] overflow-hidden">
        <button
          onClick={() => setIsBuy(true)}
          className={`flex-1 py-2 text-sm font-semibold ${
            isBuy
              ? "bg-green-400 text-black"
              : "text-gray-300 hover:bg-[#1a215a]"
          }`}
        >
          Buy
        </button>
        <button
          onClick={() => setIsBuy(false)}
          className={`flex-1 py-2 text-sm font-semibold ${
            !isBuy
              ? "bg-red-500 text-white"
              : "text-gray-300 hover:bg-[#1a215a]"
          }`}
        >
          Sell
        </button>
      </div>

      {/* QUANTITY */}
      <input
        type="number"
        min={1}
        max={100}
        value={units}
        onChange={(e) => {
          const n = e.target.valueAsNumber;
          setUnits(isNaN(n) ? 0 : n);
        }}
        disabled={loading}
        className="w-full bg-[#070d2d] border border-[#1e2a6b] rounded-lg px-3 py-2 mb-4"
      />

      {/* PRICE SUMMARY */}
      <div className="bg-[#1a1f4d] rounded-lg p-3 mb-4 text-sm">
        <div className="flex justify-between">
          <span>Price per share</span>
          <span>₹{price.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Quantity</span>
          <span>{units}</span>
        </div>
        <div className="flex justify-between font-semibold mt-1">
          <span>Total</span>
          <span>
            ₹{(isBuy ? buyPrice : sellPrice).toFixed(2)}
          </span>
        </div>
      </div>

      <button
        onClick={transact}
        disabled={
          loading ||
          units < 1 ||
          units > 100 ||
          (isBuy ?
            (owned < 0 ? getBuyPrice(price, owned + units) : getBuyPrice(price, units)) > userStore.balance :
            (owned > 0 ? getSellPrice(price, units - owned) : getSellPrice(price, units)) > userStore.balance
          )
        }
        className={`w-full py-3 rounded-lg font-semibold transition ${
          isBuy
            ? "bg-green-400 text-black hover:bg-green-300"
            : "bg-red-500 text-white hover:bg-red-400"
        } disabled:opacity-50`}
      >
        {isBuy ? "Buy" : "Sell"} ₹
        {(isBuy ? buyPrice : sellPrice).toFixed(2)}
      </button>
    </div>
  );
};

export default Transact;
