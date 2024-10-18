# Goal

Using a test-first approach, create tests for these classes.

# Background

Use Python programming language with `pytest` for testing.

# Output format

Display code in a box that has a "Copy" button.
  - Use canvas if that is available, else use code box.
  
If the  file can be executed, put appropriate shebang line on 1st line.

Put filename as a comment on the next line

# Steps

Read `Tests` section below.

Create a test class for every class under test that imports the class under test
    Example: `Class TestTransaction` should import `Class Transaction` 

For each Describe/it below, create a Python test.

After creating tests, create code that passes these tests.


# Expected Behavior

`Transaction` and `TransactionWithSplits` SHALL both define constructors, but they should be private or friends.  These classes can use their own constructor and the constructor of each other.

There SHALL be a factory method that returns `TransactionWithSplits` constructor if `category` is `SPLIT`, else it returns `Transaction` constructor.

Client code MUST use the factory method, not constructor, when trying to create `Transaction` or `TransactionWithSplits`.

A `TransactionWithSplits` MUST have category equal to 'SPLIT' and `amount` equal to '0.00'

# Tests

Describe `Class Transaction`
- it HAS-A attribute named:
  - institution
  - date
  - payee
  - amount
  - category (examples: transfer, split, groceries, rent)

It defines create-transaction that is a factory that returns a `Transaction` by default, but returns `TransactionWithSplits` if category is "SPLIT".
  
- it constructs object with positional `String` arguments.  All arguments are Strings.
- it can NOT change values after initialization
- it throws 'ValueError' if `date` argument cannot be converted to `Date` type, but stores date as a string.
- it throws 'ValueError' if `amount` argument cannot be converted to `Float`, but stores amount as a string
- it can `to-csv(headers, values)` to create CSV-formatted String
  - all headers in order of construction
  - all headers except `institution`
  - just headers `payee`, `amount`, `date` in this order

Describe `Class TransactionWithSplits`
It extends 'Transaction'
- it HAS-A list of `TransactionSplit`
- it CAN `get-splits()`

Describe `Class TransactionSplit`
It extends 'Transaction'
The constructor 
 - has parent Transaction as first parameter
 - passes remaining parameters to parent class constructor to create the child
 - does bi-directional linking (parent->child, child->parent)
- it HAS-A parent `Transaction`
