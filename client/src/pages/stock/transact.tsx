import { useState, type FormEvent } from "react"
import { makeRequest, showMessage } from "../../lib/utils"
import { useUserStore } from "../../lib/store"


type TransactProps = {
	stockId: string
	price: number
}

const Transact = (props: TransactProps) => {
	const userStore = useUserStore((state) => state)
	
	const [units, setUnits] = useState(1)
	const [loading, setLoading] = useState(false)
	
	const getBuyPrice = (n: number) => n * props.price * Math.pow(1.002, n)
	const getSellPrice = (n: number) => n * props.price * Math.pow(0.998, n)
	
	const buyPrice = getBuyPrice(units)
	const sellPrice = getSellPrice(units)
	const owned = userStore.stocks[props.stockId] || 0

	const transact = async (sell?: boolean) => {
		
		if (units < 1 || isNaN(units)) {
			showMessage("Enter a valid number of units", true)
			return;
		}
		
		if (units > 100) {
			showMessage("Cannot transact more than 100 units at once", true)
			return;
		}

		setLoading(true)

		try {
			const res = await makeRequest(
				`stocks/transact/${props.stockId}`, 'POST',
				{ "units": units * (sell ? -1 : 1) }, true
			)
			console.log(res)
			if (res["detail"]) showMessage(res["detail"]["message"], true)
			else {
				showMessage(res["message"])
				userStore.update(
					res["balance"],
					{
						...userStore.stocks,
						[props.stockId]: (userStore.stocks[props.stockId] || 0) + (sell ? -units : units)
					}
				)
			}
			
		} catch {
			showMessage("Transaction failed", true)
		} finally {
			setLoading(false)
		}
	}



	return (
		<div className="p-4">
			<div className="mb-3 text-sm">
				<div>Balance: ₹{userStore.balance.toFixed(2)}</div>
				<div>Owned: {owned}</div>
			</div>

			<input
				type="number"
				min={1} max={100}
				onChange={(ev) => {
					const n = ev.target.valueAsNumber
					setUnits(isNaN(n) ? 0 : n)
				}}
				disabled={loading}
				className="border p-2 w-full mb-3"
			/>

			<div className="flex gap-2 mb-3">
				<button
					onClick={() => transact(false)}
					disabled={
						loading || units > 100 || units < 1 || 
						(owned < 0 ? getBuyPrice(units + owned) : buyPrice) > userStore.balance
					}
					className="p-2 bg-green-600 text-white flex-1 disabled:opacity-50"
				>
					Buy ₹{buyPrice.toFixed(2)}
				</button>
				<button
					onClick={() => transact(true)}
					disabled={
						loading || units > 100 || units < 1 ||
						(units > owned ? getSellPrice(units - owned) : 0) > userStore.balance
					}
					className="p-2 bg-red-600 text-white flex-1 disabled:opacity-50"
				>
					Sell ₹{sellPrice.toFixed(2)}
				</button>
			</div>
		</div>
	)
}

export default Transact