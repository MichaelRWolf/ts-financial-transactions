#!/usr/bin/env python3
# transaction.py

from datetime import datetime

class Transaction:
    def __init__(self, institution, date, payee, amount, category):
        self._institution = institution
        self._date = self._validate_date(date)
        self._payee = payee
        self._amount = self._validate_amount(amount)
        self._category = category

    @property
    def institution(self):
        return self._institution

    @property
    def date(self):
        return self._date

    @property
    def payee(self):
        return self._payee

    @property
    def amount(self):
        return self._amount

    @property
    def category(self):
        return self._category

    @staticmethod
    def _validate_date(date_str):
        try:
            datetime.strptime(date_str, "%Y-%m-%d")
            return date_str
        except ValueError:
            raise ValueError("Invalid date format")

    @staticmethod
    def _validate_amount(amount_str):
        try:
            float(amount_str)
            return amount_str
        except ValueError:
            raise ValueError("Invalid amount format")

    @classmethod
    def create_transaction(cls, institution, date, payee, amount, category):
        if category == "SPLIT":
            return TransactionWithSplits(institution, date, payee, amount, category)
        return cls(institution, date, payee, amount, category)

    def to_csv(self, headers, values):
        return ",".join(values)

class TransactionWithSplits(Transaction):
    def __init__(self, institution, date, payee, amount, category):
        super().__init__(institution, date, payee, amount, category)
        self._splits = []

    @property
    def splits(self):
        return self._splits

    def get_splits(self):
        return self._splits

class TransactionSplit(Transaction):
    def __init__(self, parent_transaction, institution, date, payee, amount, category):
        super().__init__(institution, date, payee, amount, category)
        self._parent = parent_transaction
        parent_transaction.splits.append(self)

    @property
    def parent(self):
        return self._parent
