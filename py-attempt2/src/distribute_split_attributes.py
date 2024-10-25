#!/usr/bin/env python3
import csv
import sys
from copy import deepcopy


def distribute_all_parent_attributes(transactions):
    transformed_transactions = []
    parent = None
    for transaction in transactions:
        if transaction['category'] == 'SPLIT':
            parent = transaction
            # Convert 'amount' to number, strip "$", and validate it's zero
            amount = float(parent['amount'].replace('$', '').replace(',', ''))
            if amount != 0:
                raise ValueError(f"Parent amount must be zero, found {amount}")
            transformed_transactions.append(deepcopy(parent))
        elif not any(transaction.values()):  # Empty row
            if parent is None:
                raise ValueError("Encountered child without parent")
            child = deepcopy(parent)
            # Preserve 'category' and 'amount' from the child, fill other fields with parent values
            child.update({k: v for k, v in transaction.items() if v})
            transformed_transactions.append(child)
        else:
            transformed_transactions.append(deepcopy(transaction))
    return transformed_transactions


def main():
    reader = csv.DictReader(sys.stdin)
    fieldnames = reader.fieldnames
    transactions = list(reader)

    # Transform transactions
    transformed_transactions = distribute_all_parent_attributes(transactions)

    # Write transformed CSV to stdout
    writer = csv.DictWriter(sys.stdout, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(transformed_transactions)


if __name__ == "__main__":
    main()
