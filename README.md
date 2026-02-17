# CongoDB Engine API - Developer Code Samples

Complete reference of actual methods from `engine.js` with real code examples.

---

## 📖 Table of Contents

1. [Database Methods](#database-methods)
2. [Table Operations](#table-operations)
3. [CRUD Operations](#crud-operations)
4. [File Sync Methods](#file-sync-methods)
5. [Import/Export Methods](#importexport-methods)
6. [Query & Filtering](#query--filtering)
7. [Complete Examples](#complete-examples)

---

## Database Methods

### `initDB()`
Initialize the database in IndexedDB.

```javascript
const db = new CongoDB("myDatabase");
await db.initDB();
console.log("Database initialized");
```

### `switchDatabase(dbName)`
Switch to a different database.

```javascript
await db.switchDatabase("anotherDatabase");
console.log(`Switched to: anotherDatabase`);
```

### `createDatabase(dbName)`
Create a new database.

```javascript
const result = await db.createDatabase("newAppDB");
console.log(result.message); // Database 'newAppDB' created successfully
```

### `listDatabases()`
Get all available databases.

```javascript
const databases = await db.listDatabases();
console.log("Available databases:", databases);
// Output: ["myDatabase", "newAppDB", "testDB"]
```

### `getDatabaseData(dbName)`
Get complete data for a specific database.

```javascript
const dbData = await db.getDatabaseData("myDatabase");
console.log("Tables in database:", Object.keys(dbData.tables));
console.log("Database metadata:", dbData.metadata);
```

### `getDB()`
Get current database object.

```javascript
const currentDB = await db.getDB();
console.log("Tables:", Object.keys(currentDB.tables));
console.log("Last modified:", currentDB.metadata.lastModified);
```

### `saveDB(dbObject)`
Save database changes to IndexedDB.

```javascript
const dbData = await db.getDB();
// Make modifications
dbData.tables.newTable = { columns: {}, data: [] };
await db.saveDB(dbData);
```

---

## Table Operations

### `createTable(tokens)`
Create a new table using SQL syntax.

```javascript
// Using execute() which calls createTable internally
const result = await db.execute(`
  CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    age INT,
    isActive BOOLEAN DEFAULT 1
  )
`);

console.log(result.message); // "Table 'users' created successfully"
```

### `createIndex(tokens)`
Create an index on a table column.

```javascript
const result = await db.execute("CREATE INDEX idx_email ON users (email)");
console.log(result.message); // Index created
```

### `dropTable(tokens)` or via `execute()`
Delete a table.

```javascript
const result = await db.execute("DROP TABLE users");
console.log(result.message); // Table 'users' dropped successfully
```

### `truncateTable(tokens)` or via `execute()`
Delete all rows from a table.

```javascript
const result = await db.execute("TRUNCATE TABLE users");
console.log(result.message); // Table 'users' truncated successfully
console.log(result.deletedRows); // Number of rows deleted
```

### `dropDatabase(tokens)` or via `execute()`
Delete entire database.

```javascript
const result = await db.execute("DROP DATABASE oldDatabase");
console.log(result.message); // Database deleted
```

---

## CRUD Operations

### `insertInto(tokens)` or via `execute()`
Insert records into a table.

```javascript
// Single record
let result = await db.execute(`
  INSERT INTO users (name, email, age, isActive)
  VALUES ('John Doe', 'john@example.com', 30, 1)
`);
console.log(result.message); // "1 row(s) inserted into 'users' successfully"
console.log(result.result); // Array of inserted rows

// Multiple records
result = await db.execute(`
  INSERT INTO users (name, email, age, isActive)
  VALUES 
    ('Alice', 'alice@example.com', 25, 1),
    ('Bob', 'bob@example.com', 35, 0),
    ('Carol', 'carol@example.com', 28, 1)
`);
console.log(result.message); // "3 row(s) inserted into 'users' successfully"
```

### `selectFrom(tokens)` or via `execute()`
Query records from a table.

```javascript
// Select all
let result = await db.execute("SELECT * FROM users");
console.log(result.result); // Array of all records

// Select with WHERE clause
result = await db.execute("SELECT * FROM users WHERE age > 25");
console.log(result.result); // Records where age > 25

// Select specific columns
result = await db.execute("SELECT name, email FROM users");
console.log(result.result); // Only name and email

// Select with AND condition
result = await db.execute("SELECT * FROM users WHERE isActive = 1 AND age > 25");
console.log(result.result); // Active users over 25

// Select with OR condition
result = await db.execute("SELECT * FROM users WHERE age < 20 OR age > 60");
console.log(result.result); // Young or senior users

// Select with NOT operator
result = await db.execute("SELECT * FROM users WHERE NOT isActive = 1");
console.log(result.result); // Inactive users
```

### `updateTable(tokens)` or via `execute()`
Update records in a table.

```javascript
// Update without WHERE (all records)
let result = await db.execute("UPDATE users SET isActive = 1");
console.log(result.message); // All records updated

// Update with WHERE clause
result = await db.execute(`
  UPDATE users 
  SET age = 31, isActive = 0 
  WHERE email = 'john@example.com'
`);
console.log(result.updatedRows); // Number of records updated

// Update multiple conditions
result = await db.execute(`
  UPDATE users 
  SET isActive = 1 
  WHERE age > 25 AND age < 60
`);
```

### `deleteFrom(tokens)` or via `execute()`
Delete records from a table.

```javascript
// Delete with WHERE clause
let result = await db.execute("DELETE FROM users WHERE age < 18");
console.log(result.deletedRows); // Number of records deleted
console.log(result.result); // Array of deleted records

// Delete all (no WHERE)
result = await db.execute("DELETE FROM users");
console.log(result.deletedRows); // All records deleted
```

---

## File Sync Methods

### `enableRealTimeSync(fileHandle, enableEncryption)`
Enable real-time file synchronization.

```javascript
// File handle from File System Access API
const fileHandle = await window.showSaveFilePicker({
  suggestedName: 'database_sync.json',
  types: [{ description: 'JSON', accept: { 'application/json': ['.json'] } }]
});

// Enable sync without encryption
let result = await db.enableRealTimeSync(fileHandle);
console.log(result.message); // "Real-time append-only sync enabled: ..."

// Enable sync with encryption
result = await db.enableRealTimeSync(fileHandle, true);
console.log(result.encryption); // true
console.log(result.fileName); // filename
```

### `stopSync()`
Disable file synchronization.

```javascript
const result = db.stopSync();
console.log(result.message); // "Real-time file sync stopped"
```

### `getSyncStatus()`
Get current sync status.

```javascript
const status = db.getSyncStatus();
console.log(status.enabled); // true/false
console.log(status.fileName); // Current sync file name
console.log(status.database); // Current database name
```

### `inspectSyncFile(fileHandle)`
Inspect a sync file without loading it.

```javascript
const fileHandle = await window.showOpenFilePicker();
const metadata = await db.inspectSyncFile(fileHandle[0]);

console.log(metadata.database); // Database name
console.log(metadata.version); // File version
console.log(metadata.mode); // 'append-only'
console.log(metadata.created); // Creation timestamp
```

### `getPreviousSyncSession()`
Get previous sync session metadata from localStorage.

```javascript
const previousSession = db.getPreviousSyncSession();
if (previousSession) {
  console.log("Previous sync file:", previousSession.name);
  console.log("Database:", previousSession.dbName);
  console.log("Last sync:", previousSession.lastSync);
} else {
  console.log("No previous sync session");
}
```

### `consumeSyncLog(fileHandle, lastAppliedHash)`
Consume and apply operations from a sync file.

```javascript
const fileHandle = await window.showOpenFilePicker();
const result = await db.consumeSyncLog(fileHandle[0], null);

console.log(result.totalLines); // Total lines processed
console.log(result.appliedCount); // Operations applied
console.log(result.lastSeenHash); // Last hash for next sync
```

---

## Import/Export Methods

### `getTableCSVContent(tableName)`
Get table data as CSV string.

```javascript
const csvContent = await db.getTableCSVContent("users");
console.log(csvContent); // CSV formatted string

// Download to file
const blob = new Blob([csvContent], { type: 'text/csv' });
const url = URL.createObjectURL(blob);
const link = document.createElement('a');
link.href = url;
link.download = 'users_export.csv';
link.click();
URL.revokeObjectURL(url);
```

### `getResultsCSVContent(results, tableName)`
Convert query results to CSV.

```javascript
const results = await db.execute("SELECT * FROM users WHERE age > 25");
const csvResult = await db.getResultsCSVContent(results.result, "users_filtered");

console.log(csvResult.content); // CSV string
console.log(csvResult.fileName); // Suggested filename
console.log(csvResult.rowCount); // Number of rows
```

### `getDatabaseExcelBlob(dbName, onProgress)`
Export database to Excel file.

```javascript
const blob = await db.getDatabaseExcelBlob("myDatabase", (message) => {
  console.log("Export progress:", message);
});

// Download Excel file
const url = URL.createObjectURL(blob.blob);
const link = document.createElement('a');
link.href = url;
link.download = blob.fileName;
link.click();
URL.revokeObjectURL(url);
```

### `importTableFromCSVFile(file, tableName, overwrite)`
Import table from CSV file.

```javascript
const csvFile = document.getElementById('csvInput').files[0];
const result = await db.importTableFromCSVFile(csvFile, "imported_users", true);

console.log(result.message); // Import successful message
console.log(result.rowCount); // Number of rows imported
```

### `importTableFromExcelFile(file, sheetName, tableName, overwrite)`
Import table from Excel file.

```javascript
const excelFile = document.getElementById('excelInput').files[0];

// First, get sheet names
const sheets = await db.getExcelSheetNames(excelFile);
console.log("Available sheets:", sheets);

// Import specific sheet
const result = await db.importTableFromExcelFile(
  excelFile, 
  sheets[0],     // Sheet name
  "imported_data", // Table name
  true           // Overwrite
);

console.log(result.message);
console.log(result.rowCount);
```

### `getExcelSheetNames(file)`
Get sheet names from Excel file.

```javascript
const excelFile = document.getElementById('excelInput').files[0];
const sheetNames = await db.getExcelSheetNames(excelFile);
console.log("Sheets:", sheetNames); // ["Sheet1", "Sheet2", "Data"]
```

### `importDatabase(file, dbNameOverride)`
Import entire database from file.

```javascript
const importFile = document.getElementById('fileInput').files[0];
const result = await db.importDatabase(importFile, "imported_db");

console.log(result.message); // Import successful
console.log(result.databaseName); // Database name
console.log(result.tables); // Table list
```

### `backupAllDatabasesToBlob()`
Create backup of all databases as Excel.

```javascript
const backupResult = await db.backupAllDatabasesToBlob();

// Download backup
const url = URL.createObjectURL(backupResult.blob);
const link = document.createElement('a');
link.href = url;
link.download = backupResult.fileName; // CongoDB_backup_YYYY-MM-DD.xlsx
link.click();
URL.revokeObjectURL(url);

console.log(backupResult.message);
console.log(backupResult.databaseCount); // Number of databases
console.log(backupResult.tableCount); // Total tables
```

### `restoreFromBackupFile(file, onConflict)`
Restore databases from backup file.

```javascript
const backupFile = document.getElementById('backupInput').files[0];

const result = await db.restoreFromBackupFile(backupFile, async (dbName) => {
  // Callback for handling conflicts
  return confirm(`Database '${dbName}' already exists. Overwrite?`);
});

console.log(result.message); // Restoration complete
console.log(result.restoredDatabases); // List of restored DBs
console.log(result.totalFound); // Total databases in backup
```

---

## Query & Filtering

### `execute(query)`
Execute any SQL query.

```javascript
// Create table
await db.execute(`
  CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name TEXT NOT NULL,
    price DECIMAL,
    stock INT
  )
`);

// Insert data
await db.execute(`
  INSERT INTO products (name, price, stock)
  VALUES ('Laptop', 999.99, 5), ('Mouse', 29.99, 50)
`);

// Query data
const result = await db.execute("SELECT * FROM products WHERE stock > 0");
console.log(result.result);

// Update
await db.execute("UPDATE products SET stock = 10 WHERE name = 'Laptop'");

// Delete
await db.execute("DELETE FROM products WHERE stock = 0");
```

### Condition Operators in Queries

```javascript
// Equality
await db.execute("SELECT * FROM users WHERE status = 'active'");

// Comparison
await db.execute("SELECT * FROM users WHERE age >= 18");
await db.execute("SELECT * FROM users WHERE age <= 65");

// Not equal
await db.execute("SELECT * FROM users WHERE status != 'inactive'");

// Greater than
await db.execute("SELECT * FROM products WHERE price > 100");

// Less than
await db.execute("SELECT * FROM products WHERE price < 50");

// AND condition
await db.execute("SELECT * FROM users WHERE age > 18 AND status = 'active'");

// OR condition
await db.execute("SELECT * FROM users WHERE role = 'admin' OR role = 'moderator'");

// NOT condition
await db.execute("SELECT * FROM users WHERE NOT isActive = 0");
```

---

## Complete Examples

### Example 1: E-Commerce Store

```javascript
async function ecommerceExample() {
  const db = new CongoDB("ecommerce");
  await db.initDB();

  // Create tables
  await db.execute(`
    CREATE TABLE products (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name TEXT NOT NULL,
      price DECIMAL NOT NULL,
      stock INT,
      category TEXT
    )
  `);

  await db.execute(`
    CREATE TABLE orders (
      id INT PRIMARY KEY AUTO_INCREMENT,
      productId INT NOT NULL,
      quantity INT NOT NULL,
      totalPrice DECIMAL,
      orderDate TEXT,
      status TEXT
    )
  `);

  // Add products
  await db.execute(`
    INSERT INTO products (name, price, stock, category)
    VALUES 
      ('Laptop', 999.99, 5, 'Electronics'),
      ('Mouse', 29.99, 50, 'Electronics'),
      ('Desk', 199.99, 10, 'Furniture')
  `);

  // Get available products
  const productsResult = await db.execute("SELECT * FROM products WHERE stock > 0");
  console.log("Available products:", productsResult.result);

  // Place order
  await db.execute(`
    INSERT INTO orders (productId, quantity, totalPrice, orderDate, status)
    VALUES (1, 2, 1999.98, '${new Date().toISOString()}', 'pending')
  `);

  // Update stock after order
  await db.execute(`
    UPDATE products 
    SET stock = stock - 2 
    WHERE id = 1
  `);

  // Get all orders
  const ordersResult = await db.execute("SELECT * FROM orders WHERE status = 'pending'");
  console.log("Pending orders:", ordersResult.result);

  // Export to CSV
  const csvContent = await db.getTableCSVContent("orders");
  console.log("CSV Export:", csvContent);
}

// Run example
// await ecommerceExample();
```

### Example 2: User Management with File Sync

```javascript
async function userManagementWithSync() {
  const db = new CongoDB("company_db");
  await db.initDB();

  // Create users table
  await db.execute(`
    CREATE TABLE employees (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      department TEXT,
      salary INT,
      hireDate TEXT
    )
  `);

  // Enable file sync
  const fileHandle = await window.showSaveFilePicker({
    suggestedName: 'employees_sync.json',
    types: [{ description: 'JSON', accept: { 'application/json': ['.json'] } }]
  });

  const syncResult = await db.enableRealTimeSync(fileHandle);
  console.log("Sync enabled:", syncResult.message);

  // Add employees (automatically synced to file)
  await db.execute(`
    INSERT INTO employees (name, email, department, salary, hireDate)
    VALUES ('John Smith', 'john@company.com', 'Engineering', 80000, '2023-01-15')
  `);

  // Check sync status
  const status = db.getSyncStatus();
  console.log("Sync status:", status);

  // Query employees
  const result = await db.execute("SELECT * FROM employees WHERE department = 'Engineering'");
  console.log("Engineering team:", result.result);

  // Update salary
  await db.execute("UPDATE employees SET salary = 85000 WHERE name = 'John Smith'");

  // Export backup
  const backupResult = await db.backupAllDatabasesToBlob();
  console.log("Backup created:", backupResult.fileName);
}

// Run example
// await userManagementWithSync();
```

### Example 3: Data Import & Export Pipeline

```javascript
async function importExportExample() {
  const db = new CongoDB("pipeline_db");
  await db.initDB();

  // Create table for data
  await db.execute(`
    CREATE TABLE raw_data (
      id INT PRIMARY KEY AUTO_INCREMENT,
      source TEXT,
      value TEXT,
      timestamp TEXT
    )
  `);

  // Import from CSV
  const csvFile = document.getElementById('csvFile').files[0];
  const importResult = await db.importTableFromCSVFile(csvFile, "imported_table", true);
  console.log("CSV imported:", importResult.message);

  // Import from Excel
  const excelFile = document.getElementById('excelFile').files[0];
  const sheets = await db.getExcelSheetNames(excelFile);
  
  for (const sheet of sheets) {
    const result = await db.importTableFromExcelFile(
      excelFile,
      sheet,
      `table_${sheet}`,
      true
    );
    console.log(`Imported sheet ${sheet}:`, result.rowCount, "rows");
  }

  // Query and export results
  const queryResult = await db.execute("SELECT * FROM raw_data");
  const csvExport = await db.getResultsCSVContent(queryResult.result, "filtered_data");
  
  // Download CSV
  const blob = new Blob([csvExport.content], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = csvExport.fileName;
  link.click();

  // Backup entire database
  const backup = await db.backupAllDatabasesToBlob();
  console.log("Database backed up:", backup.fileName);
}

// Run example
// await importExportExample();
```

### Example 4: Complex Queries & Analytics

```javascript
async function analyticsExample() {
  const db = new CongoDB("analytics");
  await db.initDB();

  // Create tables
  await db.execute(`
    CREATE TABLE sales (
      id INT PRIMARY KEY AUTO_INCREMENT,
      productID INT,
      amount DECIMAL,
      saleDate TEXT,
      region TEXT,
      status TEXT
    )
  `);

  // Insert sample data
  await db.execute(`
    INSERT INTO sales (productID, amount, saleDate, region, status)
    VALUES 
      (1, 500, '2024-01-15', 'North', 'completed'),
      (2, 800, '2024-01-16', 'South', 'completed'),
      (1, 300, '2024-01-17', 'East', 'pending'),
      (3, 1200, '2024-01-18', 'West', 'completed'),
      (2, 650, '2024-01-19', 'North', 'cancelled')
  `);

  // Query 1: All completed sales
  const completed = await db.execute("SELECT * FROM sales WHERE status = 'completed'");
  console.log("Completed sales:", completed.result.length);

  // Query 2: Sales greater than 1000
  const highValue = await db.execute("SELECT * FROM sales WHERE amount > 1000");
  console.log("High value sales:", highValue.result);

  // Query 3: Sales in specific region
  const northSales = await db.execute("SELECT * FROM sales WHERE region = 'North'");
  console.log("North region sales:", northSales.result);

  // Query 4: Complex query - High value completed sales
  const premiumSales = await db.execute(
    "SELECT * FROM sales WHERE amount > 500 AND status = 'completed'"
  );
  console.log("Premium sales:", premiumSales.result);

  // Export results
  const csvResult = await db.getResultsCSVContent(premiumSales.result, "premium_sales");
  console.log("CSV data ready:", csvResult.fileName);
}

// Run example
// await analyticsExample();
```

---

## Error Handling

```javascript
async function safeExecution() {
  const db = new CongoDB("errorHandling");
  await db.initDB();

  try {
    // Try to create table
    await db.execute(`
      CREATE TABLE users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        email TEXT UNIQUE NOT NULL
      )
    `);

    // Insert data
    await db.execute("INSERT INTO users (email) VALUES ('test@example.com')");

    // This will fail due to unique constraint
    await db.execute("INSERT INTO users (email) VALUES ('test@example.com')");

  } catch (error) {
    console.error("Operation failed:", error.message);
    // Handle error appropriately
  }
}
```

---

## API Summary Table

| Method | Purpose | Async | Example |
|--------|---------|-------|---------|
| `initDB()` | Initialize database | ✓ | `await db.initDB()` |
| `execute(query)` | Run SQL query | ✓ | `await db.execute("SELECT * FROM table")` |
| `createDatabase(name)` | Create database | ✓ | `await db.createDatabase("newDB")` |
| `switchDatabase(name)` | Switch database | ✓ | `await db.switchDatabase("otherDB")` |
| `listDatabases()` | List all databases | ✓ | `const dbs = await db.listDatabases()` |
| `getDB()` | Get current database | ✓ | `const db = await db.getDB()` |
| `saveDB(dbObj)` | Save database | ✓ | `await db.saveDB(dbData)` |
| `enableRealTimeSync(handle)` | Enable file sync | ✓ | `await db.enableRealTimeSync(fileHandle)` |
| `stopSync()` | Disable sync | ✗ | `db.stopSync()` |
| `getSyncStatus()` | Get sync status | ✗ | `const status = db.getSyncStatus()` |
| `inspectSyncFile(handle)` | Read file metadata | ✓ | `await db.inspectSyncFile(fileHandle)` |
| `consumeSyncLog(handle)` | Apply sync operations | ✓ | `await db.consumeSyncLog(fileHandle)` |
| `exportAllToBlob()` | Backup all databases | ✓ | `await db.backupAllDatabasesToBlob()` |
| `importDatabase(file)` | Import database | ✓ | `await db.importDatabase(file)` |
| `getTableCSVContent(table)` | Table as CSV | ✓ | `await db.getTableCSVContent("users")` |
| `importTableFromCSVFile(file)` | Import CSV table | ✓ | `await db.importTableFromCSVFile(file)` |

**✓ = Async (requires await) | ✗ = Synchronous**

---

**All methods and examples use only functions defined in `engine.js`**
