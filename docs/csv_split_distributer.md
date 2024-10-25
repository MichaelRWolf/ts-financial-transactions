# Prompt

Goal: Transform CSV TransactionLog file by distributing split attributes from parent to child


- Input will be CSV file.  
- First row has headers.  
- Subsequent rows contain transactions.
- Most transactions are described on a single row.
- Split transactions are described on 2 or more rows
  - Let's call the first row the "parent", and all other rows "children".
  - All children are dependent on this one parent.
  - The "parent" of a split transaction has 'category' equal to "SPLIT".
  - Convert parent's 'amount' field to a number (after striping optional "$"), then throw an exception if it is non-zero.
  - The "children" of a split transaction have a 'category'
  - The "children" of a split transaction have empty fields, and _implicit_ meaning is that the "children" inherit these values from the "parent"
  
The goal of this transformation is to preserve a child's 'category' and 'amount' field, and be _explicit_ about empty/inherited fields by filling empty fields with the value from the parent.  This will allow subsequent processing to be simpler since it need not retain the child/parent relationship.


Example:
```csv
,account,state,postedOn,payee,usage,category,tags,notes,amount,action,security,description,quantity,price,commission
,"Citi Visa","PENDING","9/17/2024","Apple","","Computer Software & SaaS (business)","","","-$1.06","","","","","",""
,"Citi Visa","PENDING","9/16/2024","Caremark","","Medical Prescription Drugs - Rx (deduction)","","","-$6.09","","","","","",""
,"Chase Visa - Amazon","PENDING","9/15/2024","Amazon","","Personal Expense:Groceries","","","-$25.99","","","","","",""
,"Citi Visa","CLEARED","9/16/2024","Usps","","Postage/shipping/freight (business)","","","-$1.10","","","","","",""
,"BECU Checking","CLEARED","9/16/2024","Paypal","","Online Shopping:Shopping - Paypal (business + Personal)","","","-$10.00","","","","","",""
,"Citi Visa","CLEARED","9/15/2024","Gas Lite General Store","","Personal Expense:Groceries","","","-$68.25","","","","","",""
,"BECU Checking","CLEARED","2/15/2024","Atm Withdrawal","","SPLIT","","","$0.00","","","","","",""
,,,,,,"Personal Expense:ATM & Pocket Cash","",,"-150.00",,,,,,
,,,,,,"Personal Expense:Fees - Atm & Bank & Finance & Late & Service Charges (personal)","",,"-3.95",,,,,,
,"BECU Checking","CLEARED","2/9/2024","Refund-out Of Network Atm Fee - 6677","","Personal Expense:Fees - Atm & Bank & Finance & Late & Service Charges (personal)","","","$3.00","","","","","",""
,"BECU Checking","CLEARED","2/9/2024","Atm Withdrawal","","SPLIT","","","$0.00","","","","","",""
,,,,,,"Rent/storage (business):Rent - Technomad","",,"-300.00",,,,,,
,,,,,,"Personal Expense:Fees - Atm & Bank & Finance & Late & Service Charges (personal)","",,"-3.50",,,,,,

```


# Tasks

# Task - create function to distribute parent attributes to children

Create a python function 'distribute_all_parent_attributes' that accepts a list of objects, each of which must have attribute 'category', and returns a transformed copy of that list.

'amount' field may (or may not) contain a leading "$".  Account for this on input, and mimic this on output.

# Task - create a 'main' function

Read CSV from stdin.
Write transformed CSV to stdout.
Add she-bang line so file can be executable.
