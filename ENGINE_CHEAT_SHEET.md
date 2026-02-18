<!-- ENGINE.JS METHODS - QUICK REFERENCE CHEAT SHEET -->

# CongoDB Engine.js - Complete Method Reference

## Quick Navigation
- [Database Methods](#database-methods)
- [SQL Methods](#sql-methods)
- [CSV/Excel Methods](#csvexcel-methods)
- [Synchronization Methods](#synchronization-methods)
- [Backup/Restore Methods](#backuprestore-methods)
- [Utility Methods](#utility-methods)

---

## Database Methods

### `new CongoDB(dbName = "default")`
Creates a new database instance.
```javascript
const db = new CongoDB("myDatabase");
```

### `initDB()`
Initializes the database in IndexedDB storage.
```javascript
await db.initDB();
```

### `getDB()`
Returns the current database object.
```javascript
const dbObj = await db.getDB();
```

### `saveDB(dbObject)`
Saves database state to IndexedDB.
```javascript
const db = await db.getDB();
db.tables.newTable = {...};
await db.saveDB(db);
```

### `switchDatabase(dbName)`
Switches to a different database.
```javascript
await db.switchDatabase("anotherDatabase");
```

### `createDatabase(dbName)`
Creates a new database.
```javascript
await db.createDatabase("newDB");
```

### `listDatabases()`
Lists all available databases.
```javascript
const dbs = await db.listDatabases();
```

### `getDatabaseData(dbName)`
Gets complete data for a specific database.
```javascript
const data = await db.getDatabaseData("myDatabase");
```

---

## SQL Methods

### `execute(query)`
Main method to execute any SQL query.
```javascript
const result = await db.execute("SELECT * FROM users");
const result = await db.execute("INSERT INTO users (name) VALUES ('John')");
const result = await db.execute("UPDATE users SET age = 30 WHERE id = 1");
const result = await db.execute("DELETE FROM users WHERE id = 1");
```

### `createTable(tokens)`
Creates a table (called via execute).
```javascript
await db.execute(`
  CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE
  )
`);
```

### `selectFrom(tokens)`
Selects data (called via execute).
```javascript
await db.execute("SELECT * FROM users");
await db.execute("SELECT * FROM users WHERE age > 25");
await db.execute("SELECT name, email FROM users");
```

### `insertInto(tokens)`
Inserts records (called via execute).
```javascript
// Single
await db.execute("INSERT INTO users (name, email) VALUES ('John', 'john@example.com')");

// Multiple
await db.execute(`
  INSERT INTO users (name, email)
  VALUES ('John', 'john@example.com'), ('Jane', 'jane@example.com')
`);
```

### `updateTable(tokens)`
Updates records (called via execute).
```javascript
await db.execute("UPDATE users SET age = 30 WHERE name = 'John'");
```

### `deleteFrom(tokens)`
Deletes records (called via execute).
```javascript
await db.execute("DELETE FROM users WHERE id = 1");
```

### `truncateTable(tokens)`
Deletes all records (called via execute).
```javascript
await db.execute("TRUNCATE TABLE users");
```

### `dropTable(tokens)`
Deletes a table (called via execute).
```javascript
await db.execute("DROP TABLE users");
```

### `dropDatabase(tokens)` 
Deletes database (called via execute).
```javascript
await db.execute("DROP DATABASE oldDB");
```

### `createIndex(tokens)`
Creates an index (called via execute).
```javascript
await db.execute("CREATE INDEX idx_email ON users (email)");
```

---

## CSV/Excel Methods

### `getTableCSVContent(tableName)`
Exports table as CSV string.
```javascript
const csv = await db.getTableCSVContent("users");
console.log(csv.content);   // CSV string
console.log(csv.fileName);  // Suggested filename
console.log(csv.rowCount);  // Number of rows
```

### `getResultsCSVContent(results, tableName)`
Converts query results to CSV.
```javascript
const queryResult = await db.execute("SELECT * FROM users");
const csv = await db.getResultsCSVContent(queryResult.result, "users_export");
```

### `getDatabaseExcelBlob(dbName, onProgress)`
Exports database to Excel file.
```javascript
const blob = await db.getDatabaseExcelBlob("myDatabase", (msg) => {
  console.log(msg);  // Progress updates
});
// blob.blob - Blob object for download
// blob.fileName - Suggested filename
// blob.databaseCount - Number of databases
// blob.tableCount - Number of tables
```

### `getExcelSheetNames(file)`
Gets sheet names from Excel file.
```javascript
const sheets = await db.getExcelSheetNames(excelFile);
```

### `importTableFromCSVFile(file, tableName, overwrite)`
Imports table from CSV.
```javascript
const result = await db.importTableFromCSVFile(csvFile, "imported_users", true);
```

### `importTableFromExcelFile(file, sheetName, tableName, overwrite)`
Imports table from Excel sheet.
```javascript
const result = await db.importTableFromExcelFile(
  excelFile,
  "Sheet1",
  "imported_data",
  true
);
```

---

## Synchronization Methods

### `enableRealTimeSync(fileHandle, enableEncryption)`
Enables real-time file synchronization.
```javascript
// Without encryption
const result = await db.enableRealTimeSync(fileHandle);

// With encryption
const result = await db.enableRealTimeSync(fileHandle, true);
```

### `stopSync()`
Disables file synchronization.
```javascript
db.stopSync();
```

### `getSyncStatus()`
Gets current sync status.
```javascript
const status = db.getSyncStatus();
// status.enabled - boolean
// status.fileName - string
// status.database - string
```

### `inspectSyncFile(fileHandle)`
Inspects sync file metadata without loading.
```javascript
const metadata = await db.inspectSyncFile(fileHandle);
// metadata.database - database name
// metadata.version - version
// metadata.mode - sync mode
// metadata.created - creation timestamp
```

### `getPreviousSyncSession()`
Gets previous sync session from localStorage.
```javascript
const session = db.getPreviousSyncSession();
// session.name - filename
// session.dbName - database name
// session.lastSync - last sync time
```

### `consumeSyncLog(fileHandle, lastAppliedHash)`
Applies operations from sync file.
```javascript
const result = await db.consumeSyncLog(fileHandle, null);
// result.totalLines - total lines in file
// result.appliedCount - operations applied
// result.lastSeenHash - last hash for next sync
```

---

## Backup/Restore Methods

### `backupAllDatabasesToBlob()`
Creates backup of all databases.
```javascript
const backup = await db.backupAllDatabasesToBlob();
// backup.blob - Blob object
// backup.fileName - Suggested filename
// backup.databaseCount - Number of databases
// backup.tableCount - Total tables
```

### `restoreFromBackupFile(file, onConflict)`
Restores from backup file.
```javascript
const result = await db.restoreFromBackupFile(backupFile, async (dbName) => {
  return confirm(`Overwrite database '${dbName}'?`);
});
// result.restoredDatabases - List of restored databases
// result.totalFound - Total found in backup
```

### `importDatabase(file, dbNameOverride)`
Imports entire database from file.
```javascript
const result = await db.importDatabase(importFile, "imported_db");
// result.databaseName - Import database name
// result.tables - List of tables
```


## Common Patterns

### Pattern 1: Database Setup
```javascript
const db = new CongoDB("appName");
await db.initDB();
```

### Pattern 2: Create and Query
```javascript
await db.execute(`
  CREATE TABLE products (id INT PRIMARY KEY, name TEXT, price DECIMAL)
`);
await db.execute("INSERT INTO products VALUES (1, 'Laptop', 999.99)");
const result = await db.execute("SELECT * FROM products");
```

### Pattern 3: File Sync
```javascript
const fileHandle = await window.showSaveFilePicker();
await db.enableRealTimeSync(fileHandle);
// All operations auto-sync now
await db.execute("INSERT INTO users (name) VALUES ('John')");
```

### Pattern 4: Export & Download
```javascript
const csv = await db.getTableCSVContent("users");
const blob = new Blob([csv.content], { type: 'text/csv' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = csv.fileName;
a.click();
```

### Pattern 5: Backup
```javascript
const backup = await db.backupAllDatabasesToBlob();
const url = URL.createObjectURL(backup.blob);
const a = document.createElement('a');
a.href = url;
a.download = backup.fileName;
a.click();
```

---

## SQL Operators

### WHERE Conditions
```
=       Equal
!=      Not equal
>       Greater than
<       Less than
>=      Greater than or equal
<=      Less than or equal
AND     Both conditions true
OR      Either condition true
NOT     Negate condition
```

### Examples
```javascript
await db.execute("SELECT * FROM users WHERE age > 25");
await db.execute("SELECT * FROM users WHERE status != 'inactive'");
await db.execute("SELECT * FROM users WHERE age >= 18 AND status = 'active'");
await db.execute("SELECT * FROM users WHERE role = 'admin' OR role = 'mod'");
await db.execute("SELECT * FROM users WHERE NOT active = 0");
```

---

## Data Types

```
INT / INTEGER       Integer number
TEXT                Text string
DECIMAL             Decimal number
BOOLEAN             True/False
```

### Special Constraints
```
PRIMARY KEY         Unique identifier
AUTO_INCREMENT      Auto-incrementing ID
NOT NULL            Cannot be empty
UNIQUE              Must be unique
DEFAULT value       Default value
```

---

## Result Objects

### Execute Result
```javascript
{
  message: string,           // Operation message
  result: array,             // Result data
  executionTime: string,     // "123.45ms"
  synced: boolean,           // If synced to file
  updatedRows: number,       // For UPDATE
  deletedRows: number        // For DELETE
}
```

### Sync Result
```javascript
{
  success: boolean,
  message: string,
  fileName: string,
  mode: string,              // "append-only"
  encryption: boolean
}
```

### Status Result
```javascript
{
  enabled: boolean,
  fileName: string,
  database: string
}
```

---

## Error Handling

```javascript
try {
  const result = await db.execute("SELECT * FROM users");
  console.log(result);
} catch (error) {
  console.error("Error:", error.message);
}
```

---

## File System Access

Required browser APIs:
- IndexedDB (all data storage)
- File System Access API (file sync - optional)
- Blob API (export/download)

Browser support:
- Chrome 90+
- Firefox 88+
- Safari 15+
- Edge 90+

---

## Performance Tips

1. Use pagination for large results
2. Add indexes to frequently queried columns
3. Batch multiple inserts: `VALUES (...), (...), (...)`
4. Enable file sync only when needed
5. Use truncate instead of delete all

---

## Complete Quick Example

```javascript
// 1. Initialize
const db = new CongoDB("demo");
await db.initDB();

// 2. Create table
await db.execute(`
  CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE
  )
`);

// 3. Insert data
await db.execute(`
  INSERT INTO users (name, email)
  VALUES ('Alice', 'alice@example.com'), ('Bob', 'bob@example.com')
`);

// 4. Query
const result = await db.execute("SELECT * FROM users");
console.log(result.result);  // Array of users

// 5. Update
await db.execute("UPDATE users SET name = 'Alice Smith' WHERE id = 1");

// 6. Export
const csv = await db.getTableCSVContent("users");
console.log(csv.content);
```

---

**Last Updated: February 17, 2026**
**All methods from engine.js v1.1**
