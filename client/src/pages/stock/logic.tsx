import type { Stock, StockEntry, StocksResponse } from "../../types"

export const parse_entry = (stocks: StocksResponse) => {
    const info: Record<string, Stock> = {}
    const data: Record<string, StockEntry[]> = {}

    Object.keys(stocks).forEach((stock_id) => {
        data[stock_id] = stocks[stock_id].entries
        info[stock_id] = { ...stocks[stock_id] }
    })

    return {info, data}
}