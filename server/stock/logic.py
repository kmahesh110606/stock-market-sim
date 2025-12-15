import sqlmodel as sql

from .models import Stock, StockEntry
from user.models import User, Holding, Transaction
from data.cache import Cache


def buy_stock(
    user: User, stock: Stock, units: int,
    session: sql.Session, holding: Holding | None
):
    per_unit = StockEntry.from_json(stock.uid, Cache().get(stock.uid.hex)).close
    txn = Transaction(
        user=user.uid,
        stock=stock.uid,
        num_units=units,
        price=per_unit
    )

    if holding is not None and holding.quantity < 0:
        num_units = min(units, -holding.quantity)
        short_price = holding.short_balance / -holding.quantity
        profit = num_units * (short_price - per_unit)

        user.balance += profit + (num_units * short_price)
        holding.short_balance -= num_units * short_price
        holding.quantity += num_units
        units -= num_units

    
    if units > 0:
        price = units * per_unit * (1.001 ** units)
        if (user.balance < price):
            return { "valid": False, "message": "Insufficient balance" }
        
        print("Came here!")
        user.balance -= price
        if holding is None:
            Holding(
                user=user.uid,
                stock=stock.uid,
                quantity=units,
                short_balance=0
            ).save(session)
        else:
            holding.quantity += units
            holding.save(session)

    user.save(session)
    txn.save(session)
    return { "valid": True, "message": "Transaction successful!", "balance": user.balance }


def sell_stock(
    user: User, stock: Stock, units: int,
    session: sql.Session, holding: Holding | None
):
    per_unit = StockEntry.from_json(stock.uid, Cache().get(stock.uid.hex)).close
    txn = Transaction(
        user=user.uid,
        stock=stock.uid,
        num_units=-units,
        price=per_unit
    )
    
    if holding is not None:
        num_units = min(holding.quantity, units)

        price = num_units * per_unit * ((1/1.001) ** num_units)

        user.balance += price
        holding.quantity -= num_units
        units -= num_units
    
    if units > 0:
        price = units * per_unit * ((1/1.001) ** units)
        if (user.balance < price):
            return { "valid": False, "message": "Insufficient balance" }
        
        user.balance -= price
        if holding is None:
            Holding(
                user=user.uid,
                stock=stock.uid,
                quantity=-units,
                short_balance=price
            ).save(session)
        else:
            holding.quantity -= units
            holding.short_balance += price
            holding.save(session)

    user.save(session)
    txn.save(session)
    return { "valid": True, "message": "Transaction successful!", "balance": user.balance }
        