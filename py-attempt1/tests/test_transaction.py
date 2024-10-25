#!/usr/bin/env python3
# test_transaction.py

import pytest
from datetime import datetime

# Import the classes to be tested (these classes will be created later)
from Transaction import Transaction, TransactionWithSplits, TransactionSplit

class TestTransaction:
    def test_transaction_has_attributes(self):
        transaction = Transaction("Bank", "2024-10-11", "Payee A", "100.00", "groceries")
        assert transaction.institution == "Bank"
        assert transaction.date == "2024-10-11"
        assert transaction.payee == "Payee A"
        assert transaction.amount == "100.00"
        assert transaction.category == "groceries"

    def test_transaction_factory_creates_transaction(self):
        transaction = Transaction.create_transaction("Bank", "2024-10-11", "Payee A", "100.00", "groceries")
        assert isinstance(transaction, Transaction)

    def test_transaction_factory_creates_transaction_with_splits(self):
        transaction = Transaction.create_transaction("Bank", "2024-10-11", "Payee A", "0.00", "SPLIT")
        assert isinstance(transaction, TransactionWithSplits)

    def test_transaction_positional_arguments(self):
        transaction = Transaction("Bank", "2024-10-11", "Payee A", "100.00", "rent")
        assert transaction.institution == "Bank"
        assert transaction.date == "2024-10-11"
        assert transaction.payee == "Payee A"
        assert transaction.amount == "100.00"
        assert transaction.category == "rent"

    def test_transaction_immutable_attributes(self):
        transaction = Transaction("Bank", "2024-10-11", "Payee A", "100.00", "rent")
        with pytest.raises(AttributeError):
            transaction.amount = "200.00"

    def test_transaction_invalid_date(self):
        with pytest.raises(ValueError):
            Transaction("Bank", "invalid-date", "Payee A", "100.00", "rent")

    def test_transaction_invalid_amount(self):
        with pytest.raises(ValueError):
            Transaction("Bank", "2024-10-11", "Payee A", "invalid-amount", "rent")

    def test_transaction_to_csv_all_headers(self):
        transaction = Transaction("Bank", "2024-10-11", "Payee A", "100.00", "rent")
        csv = transaction.to_csv(headers=["institution", "date", "payee", "amount", "category"],
                                 values=[transaction.institution, transaction.date, transaction.payee, transaction.amount, transaction.category])
        assert csv == "Bank,2024-10-11,Payee A,100.00,rent"

    def test_transaction_to_csv_excluding_institution(self):
        transaction = Transaction("Bank", "2024-10-11", "Payee A", "100.00", "rent")
        csv = transaction.to_csv(headers=["date", "payee", "amount", "category"],
                                 values=[transaction.date, transaction.payee, transaction.amount, transaction.category])
        assert csv == "2024-10-11,Payee A,100.00,rent"

    def test_transaction_to_csv_specific_headers(self):
        transaction = Transaction("Bank", "2024-10-11", "Payee A", "100.00", "rent")
        csv = transaction.to_csv(headers=["payee", "amount", "date"],
                                 values=[transaction.payee, transaction.amount, transaction.date])
        assert csv == "Payee A,100.00,2024-10-11"

class TestTransactionWithSplits:
    def test_transaction_with_splits_has_list_of_splits(self):
        transaction = TransactionWithSplits("Bank", "2024-10-11", "Payee A", "0.00", "SPLIT")
        assert isinstance(transaction.splits, list)
        assert len(transaction.splits) == 0

    def test_transaction_with_splits_can_get_splits(self):
        transaction = TransactionWithSplits("Bank", "2024-10-11", "Payee A", "0.00", "SPLIT")
        assert transaction.get_splits() == []

class TestTransactionSplit:
    def test_transaction_split_has_parent(self):
        parent_transaction = Transaction.create_transaction("Bank", "2024-10-11", "Payee A", "0.00", "SPLIT")
        split = TransactionSplit(parent_transaction, "Bank", "2024-10-11", "Payee B", "50.00", "groceries")
        assert split.parent == parent_transaction
        assert parent_transaction.splits[0] == split

    def test_transaction_split_passes_remaining_parameters(self):
        parent_transaction = Transaction.create_transaction("Bank", "2024-10-11", "Payee A", "0.00", "SPLIT")
        split = TransactionSplit(parent_transaction, "Bank", "2024-10-11", "Payee B", "50.00", "groceries")
        assert split.payee == "Payee B"
        assert split.amount == "50.00"
        assert split.category == "groceries"
