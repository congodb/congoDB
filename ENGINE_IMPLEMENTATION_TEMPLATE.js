// ============================================================================
// CongoDB Engine-Only Implementation Template
// Using ONLY methods from engine.js
// ============================================================================

/**
 * IMPORTANT: This file demonstrates how to build applications using ONLY
 * the methods available in engine.js. No wrapper methods or custom functions.
 */

// ============================================================================
// SECTION 1: Basic Setup & Initialization
// ============================================================================

async function setupDatabaseEnvironment(dbName) {
  // Create database instance
  const db = new CongoDB(dbName);
  
  // Initialize IndexedDB storage
  await db.initDB();
  
  return db;
}

// Usage:
// const db = await setupDatabaseEnvironment("myApp");

// ============================================================================
// SECTION 2: Database Management
// ============================================================================

async function manageDatabases() {
  const db = new CongoDB("default");
  await db.initDB();

  // Create new database
  const newDb = await db.createDatabase("salesDB");
  console.log(newDb.message);
  // Output: Database 'salesDB' created successfully

  // List all databases
  const allDatabases = await db.listDatabases();
  console.log("All databases:", allDatabases);
  // Output: ["default", "salesDB", ...]

  // Switch to different database
  await db.switchDatabase("salesDB");
  console.log("Switched to salesDB");

  // Get database data
  const dbData = await db.getDatabaseData("salesDB");
  console.log("Tables in salesDB:", Object.keys(dbData.tables));

  // Get current database
  const currentDB = await db.getDB();
  console.log("Current DB metadata:", currentDB.metadata);
}

// ============================================================================
// SECTION 3: Table Creation & Management
// ============================================================================

async function createApplicationTables() {
  const db = new CongoDB("businessApp");
  await db.initDB();

  // Create customers table
  await db.execute(`
    CREATE TABLE customers (
      id INT PRIMARY KEY AUTO_INCREMENT,
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      dateJoined TEXT,
      isActive BOOLEAN DEFAULT 1
    )
  `);

  // Create products table  
  await db.execute(`
    CREATE TABLE products (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name TEXT UNIQUE NOT NULL,
      sku TEXT NOT NULL,
      price DECIMAL NOT NULL,
      stock INT NOT NULL,
      category TEXT,
      description TEXT
    )
  `);

  // Create orders table
  await db.execute(`
    CREATE TABLE orders (
      id INT PRIMARY KEY AUTO_INCREMENT,
      customerId INT NOT NULL,
      orderDate TEXT NOT NULL,
      totalAmount DECIMAL,
      status TEXT,
      shippingAddress TEXT
    )
  `);

  // Create order items table
  await db.execute(`
    CREATE TABLE orderItems (
      id INT PRIMARY KEY AUTO_INCREMENT,
      orderId INT NOT NULL,
      productId INT NOT NULL,
      quantity INT NOT NULL,
      unitPrice DECIMAL,
      lineTotal DECIMAL
    )
  `);

  console.log("All tables created successfully");
}

// ============================================================================
// SECTION 4: CRUD Operations - INSERT
// ============================================================================

async function demonstrateInsert() {
  const db = new CongoDB("businessApp");
  await db.initDB();

  // Single INSERT
  let result = await db.execute(`
    INSERT INTO customers (firstName, lastName, email, phone, dateJoined, isActive)
    VALUES ('John', 'Doe', 'john.doe@example.com', '555-0001', '2024-01-15', 1)
  `);
  console.log("Single insert result:", result.message);
  console.log("Inserted row:", result.result[0]);

  // Multiple INSERT (batch operation)
  result = await db.execute(`
    INSERT INTO customers (firstName, lastName, email, phone, dateJoined, isActive)
    VALUES 
      ('Jane', 'Smith', 'jane.smith@example.com', '555-0002', '2024-01-16', 1),
      ('Bob', 'Johnson', 'bob.johnson@example.com', '555-0003', '2024-01-17', 0),
      ('Alice', 'Williams', 'alice.williams@example.com', '555-0004', '2024-01-18', 1),
      ('Charlie', 'Brown', 'charlie.brown@example.com', '555-0005', '2024-01-19', 1)
  `);
  console.log("Batch insert result:", result.message);
  console.log("Inserted", result.result.length, "rows");

  // Insert products
  await db.execute(`
    INSERT INTO products (name, sku, price, stock, category, description)
    VALUES 
      ('Laptop', 'TECH-LP001', 999.99, 10, 'Electronics', 'High-performance laptop'),
      ('Mouse', 'TECH-MS001', 29.99, 100, 'Electronics', 'Wireless mouse'),
      ('Keyboard', 'TECH-KB001', 79.99, 50, 'Electronics', 'Mechanical keyboard'),
      ('Monitor', 'TECH-MN001', 299.99, 15, 'Electronics', '4K UltraWide monitor')
  `);

  console.log("Products inserted successfully");
}

// ============================================================================
// SECTION 5: CRUD Operations - SELECT
// ============================================================================

async function demonstrateSelect() {
  const db = new CongoDB("businessApp");
  await db.initDB();

  // Select all records
  let result = await db.execute("SELECT * FROM customers");
  console.log("All customers:", result.result);

  // Select specific columns
  result = await db.execute("SELECT firstName, lastName, email FROM customers");
  console.log("Customer names and emails:", result.result);

  // Select with WHERE - single condition
  result = await db.execute("SELECT * FROM customers WHERE isActive = 1");
  console.log("Active customers:", result.result);

  // Select with WHERE - comparison operators
  result = await db.execute("SELECT * FROM products WHERE price > 100");
  console.log("Expensive products:", result.result);

  result = await db.execute("SELECT * FROM products WHERE stock <= 20");
  console.log("Low stock products:", result.result);

  // Select with AND condition
  result = await db.execute(`
    SELECT * FROM products 
    WHERE category = 'Electronics' AND price < 500
  `);
  console.log("Affordable electronics:", result.result);

  // Select with OR condition
  result = await db.execute(`
    SELECT * FROM customers 
    WHERE firstName = 'John' OR firstName = 'Jane'
  `);
  console.log("Johns and Janes:", result.result);

  // Select with NOT condition
  result = await db.execute("SELECT * FROM customers WHERE NOT isActive = 1");
  console.log("Inactive customers:", result.result);

  // Complex WHERE with multiple conditions
  result = await db.execute(`
    SELECT * FROM customers 
    WHERE isActive = 1 AND (firstName = 'John' OR firstName = 'Jane')
  `);
  console.log("Active Johns and Janes:", result.result);
}

// ============================================================================
// SECTION 6: CRUD Operations - UPDATE
// ============================================================================

async function demonstrateUpdate() {
  const db = new CongoDB("businessApp");
  await db.initDB();

  // Update without WHERE (all records)
  let result = await db.execute("UPDATE customers SET isActive = 1");
  console.log("Updated", result.updatedRows, "rows to active");

  // Update with WHERE clause
  result = await db.execute(`
    UPDATE customers 
    SET isActive = 0 
    WHERE firstName = 'Bob'
  `);
  console.log("Deactivated Bob's account");

  // Update multiple columns
  result = await db.execute(`
    UPDATE customers 
    SET phone = '555-1234', isActive = 1 
    WHERE email = 'john.doe@example.com'
  `);
  console.log("Updated John's info");

  // Update with condition
  result = await db.execute(`
    UPDATE products 
    SET stock = stock - 5 
    WHERE name = 'Laptop'
  `);
  console.log("Updated laptop stock");

  // Update based on multiple conditions
  result = await db.execute(`
    UPDATE customers 
    SET isActive = 0 
    WHERE dateJoined < '2024-01-18' AND phone IS NULL
  `);
  console.log("Updated old customers without phone");
}

// ============================================================================
// SECTION 7: CRUD Operations - DELETE
// ============================================================================

async function demonstrateDelete() {
  const db = new CongoDB("businessApp");
  await db.initDB();

  // Delete with WHERE clause
  let result = await db.execute("DELETE FROM customers WHERE isActive = 0");
  console.log("Deleted", result.deletedRows, "inactive customers");
  console.log("Deleted records:", result.result);

  // Delete specific record
  result = await db.execute("DELETE FROM products WHERE sku = 'TECH-MS001'");
  console.log("Deleted product, rows affected:", result.deletedRows);

  // Delete with multiple conditions
  result = await db.execute(`
    DELETE FROM customers 
    WHERE dateJoined < '2024-01-17' AND isActive = 0
  `);
  console.log("Deleted old inactive customers");

  // Delete all records (no WHERE)
  // result = await db.execute("DELETE FROM orderItems");
  // console.log("Deleted all order items");
}

// ============================================================================
// SECTION 8: TRUNCATE (Delete All)
// ============================================================================

async function demonstrateTruncate() {
  const db = new CongoDB("businessApp");
  await db.initDB();

  // Delete all rows in table (but keep schema)
  const result = await db.execute("TRUNCATE TABLE orderItems");
  console.log("Truncated table:", result.message);
  console.log("Deleted rows:", result.deletedRows);
}

// ============================================================================
// SECTION 9: DROP TABLE & DATABASE
// ============================================================================

async function demonstrateDropOperations() {
  const db = new CongoDB("businessApp");
  await db.initDB();

  // Drop table
  let result = await db.execute("DROP TABLE orderItems");
  console.log("Table dropped:", result.message);

  // Drop database
  result = await db.execute("DROP DATABASE tempDatabase");
  console.log("Database dropped:", result.message);
}

// ============================================================================
// SECTION 10: File Synchronization
// ============================================================================

async function demonstrateFileSync() {
  const db = new CongoDB("businessApp");
  await db.initDB();

  try {
    // Get file handle from user
    const fileHandle = await window.showSaveFilePicker({
      suggestedName: 'businessapp_sync.json',
      types: [{ description: 'JSON', accept: { 'application/json': ['.json'] } }]
    });

    // Enable real-time sync (without encryption)
    let syncResult = await db.enableRealTimeSync(fileHandle);
    console.log("Sync enabled:", syncResult.message);
    console.log("File name:", syncResult.fileName);
    console.log("Mode:", syncResult.mode);

    // From now on, all INSERT, UPDATE, DELETE operations are automatically synced to file

    // Insert data (automatically synced)
    await db.execute(`
      INSERT INTO customers (firstName, lastName, email, dateJoined)
      VALUES ('Test', 'User', 'test@example.com', '2024-02-17')
    `);
    console.log("Data inserted and synced automatically");

    // Check sync status
    const status = db.getSyncStatus();
    console.log("Sync status:", {
      enabled: status.enabled,
      file: status.fileName,
      database: status.database
    });

    // Stop sync when done
    const stopResult = db.stopSync();
    console.log(stopResult.message);

  } catch (error) {
    console.error("Sync error:", error.message);
  }
}

// ============================================================================
// SECTION 11: Encryption Support (with File Sync)
// ============================================================================

async function demonstrateEncryptedSync() {
  const db = new CongoDB("businessApp");
  await db.initDB();

  try {
    const fileHandle = await window.showSaveFilePicker({
      suggestedName: 'encrypted_sync.json',
      types: [{ description: 'JSON', accept: { 'application/json': ['.json'] } }]
    });

    // Enable sync WITH encryption
    const syncResult = await db.enableRealTimeSync(fileHandle, true);
    console.log("Encrypted sync enabled:", syncResult.encryption);
    console.log("Mode:", syncResult.mode);

    // All data written to file is encrypted with AES-GCM
    // Requiring the same encryption key to decrypt

  } catch (error) {
    console.error("Error:", error.message);
  }
}

// ============================================================================
// SECTION 12: Import/Export CSV
// ============================================================================

async function demonstrateCSVOperations() {
  const db = new CongoDB("businessApp");
  await db.initDB();

  // Export table to CSV
  let csvResult = await db.getTableCSVContent("customers");
  console.log("CSV Content:", csvResult.content);
  console.log("Suggested filename:", csvResult.fileName);

  // Export query results to CSV
  const queryResult = await db.execute("SELECT * FROM products WHERE price > 100");
  csvResult = await db.getResultsCSVContent(queryResult.result, "expensive_products");
  console.log("Exported", csvResult.rowCount, "rows");

  // Download CSV (client-side)
  const blob = new Blob([csvResult.content], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = csvResult.fileName;
  // link.click(); // Uncomment to trigger download
  console.log("CSV ready for download");

  // Import CSV file
  const csvFile = document.getElementById('csvFileInput')?.files?.[0];
  if (csvFile) {
    const importResult = await db.importTableFromCSVFile(
      csvFile,
      "imported_customers",
      true // Overwrite if exists
    );
    console.log("Import result:", importResult.message);
    console.log("Rows imported:", importResult.rowCount);
  }
}

// ============================================================================
// SECTION 13: Import/Export Excel
// ============================================================================

async function demonstrateExcelOperations() {
  const db = new CongoDB("businessApp");
  await db.initDB();

  // Export entire database to Excel
  const excelBlob = await db.getDatabaseExcelBlob("businessApp", (message) => {
    console.log("Export progress:", message);
  });

  console.log("Excel export complete:", excelBlob.fileName);
  console.log("Database count:", excelBlob.databaseCount);
  console.log("Table count:", excelBlob.tableCount);

  // Download Excel
  const url = URL.createObjectURL(excelBlob.blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = excelBlob.fileName;
  // link.click(); // Uncomment to trigger download

  // Get sheet names from Excel file
  const excelFile = document.getElementById('excelFileInput')?.files?.[0];
  if (excelFile) {
    const sheetNames = await db.getExcelSheetNames(excelFile);
    console.log("Available sheets:", sheetNames);

    // Import specific sheet
    const importResult = await db.importTableFromExcelFile(
      excelFile,
      sheetNames[0],      // First sheet
      "imported_data",    // New table name
      true                // Overwrite
    );
    console.log("Imported:", importResult.message);
    console.log("Rows:", importResult.rowCount);
  }
}

// ============================================================================
// SECTION 14: Backup & Restore
// ============================================================================

async function demonstrateBackupRestore() {
  const db = new CongoDB("businessApp");
  await db.initDB();

  // Create backup of all databases
  const backupResult = await db.backupAllDatabasesToBlob();
  console.log("Backup created:", backupResult.fileName);
  console.log("Databases:", backupResult.databaseCount);
  console.log("Tables:", backupResult.tableCount);

  // Download backup
  const url = URL.createObjectURL(backupResult.blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = backupResult.fileName;
  // link.click(); // Uncomment to download

  // Restore from backup
  const backupFile = document.getElementById('backupFileInput')?.files?.[0];
  if (backupFile) {
    try {
      const restoreResult = await db.restoreFromBackupFile(
        backupFile,
        async (dbName) => {
          // Callback for handling existing databases
          return confirm(`Database '${dbName}' exists. Overwrite?`);
        }
      );

      console.log("Restore complete:", restoreResult.message);
      console.log("Restored databases:", restoreResult.restoredDatabases);
      console.log("Total found in backup:", restoreResult.totalFound);
    } catch (error) {
      console.error("Restore failed:", error.message);
    }
  }
}

// ============================================================================
// SECTION 15: Import Full Database
// ============================================================================

async function demonstrateFullDatabaseImport() {
  const db = new CongoDB("businessApp");
  await db.initDB();

  const importFile = document.getElementById('importFileInput')?.files?.[0];
  if (importFile) {
    try {
      const result = await db.importDatabase(importFile, "imported_database");
      console.log("Database imported:", result.message);
      console.log("Name:", result.databaseName);
      console.log("Tables:", result.tables);
    } catch (error) {
      console.error("Import failed:", error.message);
    }
  }
}

// ============================================================================
// SECTION 16: Working with Sync Files
// ============================================================================

async function demonstrateSyncFileOperations() {
  const db = new CongoDB("businessApp");
  await db.initDB();

  // Inspect sync file metadata (without loading)
  try {
    const fileHandle = await window.showOpenFilePicker({
      types: [{ description: 'JSON', accept: { 'application/json': ['.json'] } }]
    });

    const metadata = await db.inspectSyncFile(fileHandle[0]);
    console.log("Sync file metadata:", {
      database: metadata.database,
      version: metadata.version,
      mode: metadata.mode,
      created: metadata.created
    });

    // Check previous sync session
    const previousSession = db.getPreviousSyncSession();
    if (previousSession) {
      console.log("Last synced file:", previousSession.name);
      console.log("Last sync time:", previousSession.lastSync);
    }

    // Manually consume sync log
    const result = await db.consumeSyncLog(fileHandle[0], null);
    console.log("Sync log processed:", {
      totalLines: result.totalLines,
      applied: result.appliedCount,
      lastHash: result.lastSeenHash
    });

  } catch (error) {
    console.error("Sync file error:", error.message);
  }
}

// ============================================================================
// SECTION 17: Complete Real-World Application
// ============================================================================

async function completeApplicationExample() {
  // Initialize database
  const db = new CongoDB("onlineStore");
  await db.initDB();

  try {
    // Enable file sync
    const fileHandle = await window.showSaveFilePicker({
      suggestedName: 'store_sync.json'
    });
    await db.enableRealTimeSync(fileHandle);

    // Create tables
    await db.execute(`
      CREATE TABLE products (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name TEXT NOT NULL,
        price DECIMAL NOT NULL,
        stock INT NOT NULL
      )
    `);

    await db.execute(`
      CREATE TABLE orders (
        id INT PRIMARY KEY AUTO_INCREMENT,
        productId INT NOT NULL,
        quantity INT NOT NULL,
        orderDate TEXT,
        status TEXT
      )
    `);

    // Insert products
    await db.execute(`
      INSERT INTO products (name, price, stock)
      VALUES ('Product A', 99.99, 100), ('Product B', 149.99, 50)
    `);

    // Create order
    const orderResult = await db.execute(`
      INSERT INTO orders (productId, quantity, orderDate, status)
      VALUES (1, 2, '2024-02-17', 'pending')
    `);
    console.log("Order created:", orderResult.result);

    // Update stock
    await db.execute("UPDATE products SET stock = 98 WHERE id = 1");

    // Check order
    const order = await db.execute("SELECT * FROM orders WHERE status = 'pending'");
    console.log("Pending orders:", order.result);

    // Export
    const csvResult = await db.getTableCSVContent("orders");
    console.log("Export ready:", csvResult.fileName);

    // Status
    console.log("Sync status:", db.getSyncStatus());

  } catch (error) {
    console.error("Application error:", error.message);
  }
}

// ============================================================================
// EXPORT ALL FUNCTIONS
// ============================================================================

export {
  setupDatabaseEnvironment,
  manageDatabases,
  createApplicationTables,
  demonstrateInsert,
  demonstrateSelect,
  demonstrateUpdate,
  demonstrateDelete,
  demonstrateTruncate,
  demonstrateDropOperations,
  demonstrateFileSync,
  demonstrateEncryptedSync,
  demonstrateCSVOperations,
  demonstrateExcelOperations,
  demonstrateBackupRestore,
  demonstrateFullDatabaseImport,
  demonstrateSyncFileOperations,
  completeApplicationExample
};

// ============================================================================
// USAGE IN HTML
// ============================================================================

/*

<script src="engine.js"></script>
<script type="module">
  import { 
    setupDatabaseEnvironment,
    demonstrateInsert,
    demonstrateSelect,
    demonstrateUpdate
  } from 'engine-implementation-template.js';

  // Initialize database
  const db = await setupDatabaseEnvironment("myApp");

  // Use database
  await demonstrateInsert();
  await demonstrateSelect();
  await demonstrateUpdate();
</script>

*/

// ============================================================================
// KEY PRINCIPLES
// ============================================================================

/*

1. ALL operations use db.execute(sqlQuery) for SQL commands
2. File sync is automatic after enableRealTimeSync()
3. All methods are async and require await
4. Error handling with try-catch blocks
5. No wrapper functions - use engine.js methods directly
6. CSV and Excel export built-in
7. Backup and restore functionality included
8. Multiple databases supported

ALWAYS REMEMBER:
- Await async functions
- Use db.execute() for SQL operations
- Call db.initDB() before using db
- enableRealTimeSync() for persistent file sync
- Check getSyncStatus() to verify sync is active

*/
