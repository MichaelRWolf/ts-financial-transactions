#!/usr/bin/env python3

"""
This module provides functionality for transforming CSV transaction logs by distributing attributes 
from parent transactions to child transactions.

The goal of this transformation is to make all empty child fields explicit by filling them in with 
the corresponding value from the parent. This allows for easier subsequent processing without the 
need to retain the child/parent relationship.

Functions:
    distribute_all_parent_attributes(transactions): Distributes parent attributes to child rows.
    main(): Reads a CSV from stdin, processes it, and writes the transformed CSV to stdout.
"""

import csv
import sys
import copy

def distribute_all_parent_attributes(transactions):
    """
    Distribute parent attributes to child rows in a list of transaction objects.

    Args:
        transactions (list of dict): List of transaction objects with attributes like 'category' and 'amount'.

    Returns:
        list of dict: Transformed list where child rows inherit parent's attributes.
    """
    transformed_transactions = []
    parent_transaction = None

    for transaction in transactions:
        # If the transaction is a parent (category is 'SPLIT'), store it
        if transaction['category'] == 'SPLIT':
            # Convert amount to number and check if it is zero
            amount_str = transaction['amount'].replace('$', '').strip()
            amount = float(amount_str) if amount_str else 0.0
            if amount != 0:
                raise ValueError("Parent transaction amount must be zero.")
            parent_transaction = transaction
            transformed_transactions.append(copy.deepcopy(transaction))
        # If the transaction is a child (empty leading fields), inherit from parent
        elif parent_transaction and not any(transaction[key] for key in ['account', 'state', 'postedOn', 'payee']):
            child_transaction = copy.deepcopy(parent_transaction)
            # Update child_transaction with non-empty values from transaction
            for key, value in transaction.items():
                if value:
                    child_transaction[key] = value
            transformed_transactions.append(child_transaction)
        # Otherwise, it's an independent transaction, just append it
        else:
            transformed_transactions.append(copy.deepcopy(transaction))
            
    return transformed_transactions

def main():
    """
    Read CSV from stdin, process it, and write the transformed CSV to stdout.
    """
    # Ensure consistent newline handling
    input_stream = open(sys.stdin.fileno(), mode='r', newline='', encoding='utf-8')
    output_stream = open(sys.stdout.fileno(), mode='w', newline='', encoding='utf-8')

    # Read CSV from stdin
    reader = csv.DictReader(input_stream)
    transactions = list(reader)

    # Transform transactions
    transformed_transactions = distribute_all_parent_attributes(transactions)

    # Write transformed CSV to stdout
    writer = csv.DictWriter(output_stream, fieldnames=reader.fieldnames)
    writer.writeheader()
    writer.writerows(transformed_transactions)

if __name__ == "__main__":
    main()
