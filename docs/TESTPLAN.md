# COBOL Application Test Plan

> Purpose: Validate current COBOL business logic with stakeholders and serve as a basis for Node.js unit/integration tests during modernization.

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status (Pass/Fail) | Comments |
|---|---|---|---|---|---|---|---|
| TC-001 | View balance (initial value) | Application started; no prior operations | 1. Select menu option 1 (View Balance) | Displays current balance as 1000.00 |  |  |  |
| TC-002 | Credit succeeds (valid amount) | Application started | 1. Select menu option 2 (Credit Account)<br>2. Enter credit amount 100.00 | Displays “Amount credited. New balance: 1100.00” |  |  |  |
| TC-003 | Debit succeeds (sufficient balance) | Application started | 1. Select menu option 3 (Debit Account)<br>2. Enter debit amount 200.00 | Displays “Amount debited. New balance: 800.00” |  |  |  |
| TC-004 | Debit fails (insufficient funds) | Application started | 1. Select menu option 3 (Debit Account)<br>2. Enter debit amount 2000.00 | Displays “Insufficient funds for this debit.”; balance remains unchanged |  |  |  |
| TC-005 | Balance reflects credit | Application started | 1. Credit 50.00 (menu option 2)<br>2. View Balance (menu option 1) | Balance displays 1050.00 |  |  |  |
| TC-006 | Balance reflects debit | Application started | 1. Debit 50.00 (menu option 3)<br>2. View Balance (menu option 1) | Balance displays 950.00 |  |  |  |
| TC-007 | Multiple operations compute correctly | Application started | 1. Credit 100.00<br>2. Debit 40.00<br>3. View Balance | Balance displays 1060.00 |  |  |  |
| TC-008 | Invalid menu input is handled | Application started | 1. Enter menu option 9 | Displays “Invalid choice, please select 1-4.” and re-prompts |  |  |  |
| TC-009 | Exit program | Application started | 1. Enter menu option 4 | Displays “Exiting the program. Goodbye!” and terminates |  |  |  |
| TC-010 | Balance persists within session | Application started | 1. View Balance (1000.00)<br>2. Credit 25.00<br>3. View Balance | Second view displays 1025.00 |  |  |  |
| TC-011 | Data layer read path | Application started | 1. View Balance (menu option 1) | `Operations` calls `DataProgram` with READ and displays balance |  |  |  |
| TC-012 | Data layer write path | Application started | 1. Credit 10.00 (menu option 2) | `Operations` calls `DataProgram` with WRITE and displays 1010.00 |  |  |  |
