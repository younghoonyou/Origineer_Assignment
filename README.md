## POS State Machine Design

![Image](https://github.com/user-attachments/assets/1fe927a8-a9f6-4705-ace6-00e259d43637)

- Seperate Transaction Module and Ledger Module to handle and write data.
- User can not access Ledger Module directly.
- By using state machine handler, consider future additional features.
- TDD is mainly written in requirements and tested out exceptional case that can handle Error

## LedgerStateMachine Class
Instead of using database save In memory data in LedgerStateMachine class with singleton pattern. User can not access this class directly.

*TDD were built with main requirements on Assignment pdf

### public handler: Give an action for each 5 behaviours. 
- ADD_ITEM
- APPLY_CASH_ROUNDING
- CALCULATE_TOTALS
- POST
- CANCEL


```ts
public getTransactionInfo(id: string): Transaction
```
Return transaction information

```ts
public getDailySummary(
    date: string
  ): DailySummary | null
```
Return daily summary by date

---

## TransactionManager Class
It is used to handle main transaction process from user API by using LedgerStateMachine with singleton pattern.

```ts
public initiateTransaction(
    type: TransactionType,
    method: 'CASH' | 'CARD',
    items: LineItem[],
    parentTransactionId: string | null = null
  ): Transaction | null
```
Run transaction for each type [‘SALE’, ‘REFUND’]

```ts
public cancelTransaction(id: string): void
```
Run CANCEL mechanism

```ts
public getTransactionInfo(id: string): Transaction
```
Get specific Transaction information

```ts
public getDailySummary(date: string): DailySummary | null
```
Get Daily summarize transaction information



---



## How to test

Run Jest
```
npm run test
```


1. Run server
```
npm run dev
```
2. Test SALE transaction
```
npm run test:sale
```
3. Test REFUND transaction
```
npm run test:refund
```
4. Test Daily Summary Report
```
npm run test:summary
```

⚠️ Please modify json file in test-data folder
⚠️ Please run below command to install packages
```
npm install
```
