# CongoDB Engine.js - Developer Templates Collection

Complete code templates and examples using **ONLY** methods from `engine.js`.

---

## 📚 Available Code Templates

### 1. **ENGINE_CHEAT_SHEET.md** ⭐ START HERE
**Quick reference for all engine.js methods**

```
✓ Complete method list
✓ Quick syntax reference
✓ Common patterns
✓ SQL operators guide
✓ One-page reference
```

**When to use:** Need a quick lookup for method syntax
**Time to read:** 5 minutes

---

### 2. **ENGINE_API_REFERENCE.md** 📖 COMPREHENSIVE GUIDE
**Detailed API documentation with real examples**

```
✓ All database methods with examples
✓ CRUD operations (Create, Read, Update, Delete)
✓ File sync methods
✓ Import/export methods
✓ Query filtering examples
✓ 4 complete working examples
✓ Error handling patterns
```

**When to use:** Building new features, learning the API
**Time to read:** 30 minutes

---

### 3. **ENGINE_IMPLEMENTATION_TEMPLATE.js** 💻 CODE TEMPLATE
**Production-ready JavaScript code**

```
✓ 17 complete implementation sections
✓ Database management
✓ CRUD operations
✓ CSV/Excel operations
✓ File sync implementation
✓ Backup and restore
✓ Complete real-world application example
✓ Copy-paste ready code
```

**When to use:** Implementing specific features
**Time to read:** 20 minutes, then use as reference

---

### 4. **ENGINE_TEMPLATE.html** 🎨 INTERACTIVE UI
**Ready-to-use HTML interface**

```
✓ Complete working application
✓ Database setup interface
✓ SQL query executor
✓ Insert/Update/Delete UI
✓ Export to CSV/Excel
✓ Backup functionality
✓ File sync controls
```

**When to use:** Testing database operations, prototyping
**How to use:** Open in browser, start executing queries

---

## 🚀 Quick Start Guide

### Step 1: Understand the API (5 min)
```bash
→ Read: ENGINE_CHEAT_SHEET.md
→ Learn: Basic methods and syntax
```

### Step 2: Deep Dive (30 min)
```bash
→ Read: ENGINE_API_REFERENCE.md
→ Examples: Database, CRUD, Import/Export, Sync
```

### Step 3: Build Your App
```bash
→ Use: ENGINE_IMPLEMENTATION_TEMPLATE.js
→ Reference: Copy patterns for your features
```

### Step 4: Test It (5 min)
```bash
→ Open: ENGINE_TEMPLATE.html
→ Test: Execute queries, export data
```

---

## 📋 Code Examples by Use Case

### Use Case 1: Simple Database App
```javascript
import { 
  createApplicationTables,
  demonstrateInsert,
  demonstrateSelect
} from './ENGINE_IMPLEMENTATION_TEMPLATE.js';

await createApplicationTables();
await demonstrateInsert();
await demonstrateSelect();
```

### Use Case 2: File Sync App
```javascript
import { demonstrateFileSync } from './ENGINE_IMPLEMENTATION_TEMPLATE.js';

// Enables automatic sync of all operations to file
await demonstrateFileSync();
```

### Use Case 3: Data Import/Export
```javascript
import { 
  demonstrateCSVOperations,
  demonstrateExcelOperations
} from './ENGINE_IMPLEMENTATION_TEMPLATE.js';

await demonstrateCSVOperations();
await demonstrateExcelOperations();
```

### Use Case 4: Backup & Restore
```javascript
import { 
  demonstrateBackupRestore,
  demonstrateFullDatabaseImport
} from './ENGINE_IMPLEMENTATION_TEMPLATE.js';

await demonstrateBackupRestore();
await demonstrateFullDatabaseImport();
```

---

## 🔧 Method Categories

### Database Management
```javascript
// From ENGINE_API_REFERENCE.md - Database Methods Section

db.initDB()                    // Initialize
db.switchDatabase(name)        // Switch DB
db.createDatabase(name)        // Create DB
db.listDatabases()             // List all
db.getDatabaseData(name)       // Get data
db.getDB()                     // Current DB
db.saveDB(dbObjeto)            // Save DB
```

### CRUD Operations
```javascript
// All use db.execute() with SQL

db.execute("CREATE TABLE...")  // Create table
db.execute("INSERT INTO...")   // Insert records
db.execute("SELECT * FROM...")// Query
db.execute("UPDATE...")        // Update records
db.execute("DELETE FROM...")   // Delete records
db.execute("DROP TABLE...")    // Delete table
db.execute("TRUNCATE...")      // Clear all rows
```

### File Operations
```javascript
// From ENGINE_API_REFERENCE.md - Import/Export Section

db.getTableCSVContent()        // Export CSV
db.getResultsCSVContent()      // Export results
db.getDatabaseExcelBlob()      // Export Excel
db.importTableFromCSVFile()    // Import CSV
db.importTableFromExcelFile()  // Import Excel
db.importDatabase()            // Import DB
db.backupAllDatabasesToBlob()  // Backup all
db.restoreFromBackupFile()     // Restore
```

### File Sync
```javascript
// From ENGINE_API_REFERENCE.md - File Sync Section

db.enableRealTimeSync()        // Enable sync
db.stopSync()                  // Stop sync
db.getSyncStatus()             // Check status
db.inspectSyncFile()           // Inspect file
db.consumeSyncLog()            // Apply operations
db.getPreviousSyncSession()    // Previous session
```

---

## 💡 Implementation Patterns

### Pattern 1: Database Setup
```javascript
// From ENGINE_IMPLEMENTATION_TEMPLATE.js - Section 1
const db = new CongoDB("myApp");
await db.initDB();
```

### Pattern 2: Create & Populate Table
```javascript
// From ENGINE_IMPLEMENTATION_TEMPLATE.js - Section 3 & 4
await db.execute(`
  CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE
  )
`);

await db.execute(`
  INSERT INTO users (name, email)
  VALUES ('John', 'john@example.com')
`);
```

### Pattern 3: Query Data
```javascript
// From ENGINE_IMPLEMENTATION_TEMPLATE.js - Section 5
const result = await db.execute("SELECT * FROM users WHERE age > 25");
console.log(result.result);
```

### Pattern 4: Enable File Sync
```javascript
// From ENGINE_IMPLEMENTATION_TEMPLATE.js - Section 10
const fileHandle = await window.showSaveFilePicker();
await db.enableRealTimeSync(fileHandle);
// Now all operations auto-sync to file
```

### Pattern 5: Export & Download
```javascript
// From ENGINE_IMPLEMENTATION_TEMPLATE.js - Section 12
const csv = await db.getTableCSVContent("users");
const blob = new Blob([csv.content], { type: 'text/csv' });
const url = URL.createObjectURL(blob);
const link = document.createElement('a');
link.href = url;
link.download = csv.fileName;
link.click();
```

---

## 🎯 Feature Checklist

### Database Features
- [x] Multiple databases
- [x] Multiple tables per database
- [x] Auto-increment IDs
- [x] Unique constraints
- [x] NOT NULL constraints
- [x] Default values
- [x] Indexes

### CRUD Operations
- [x] Single insert
- [x] Batch insert
- [x] Select all/filtered
- [x] Update with WHERE
- [x] Delete with WHERE
- [x] Truncate table
- [x] Drop table

### File Operations
- [x] Export to CSV
- [x] Export to Excel
- [x] Import from CSV
- [x] Import from Excel
- [x] Full database import
- [x] Backup all databases
- [x] Restore from backup

### Sync Features
- [x] Real-time sync to file
- [x] Append-only mode
- [x] AES-GCM encryption
- [x] Sync status tracking
- [x] Previous session recovery
- [x] Incremental replay

---

## 🔗 File Dependencies

```
engine.js
    ↓
All templates use ONLY methods from engine.js

ENGINE_CHEAT_SHEET.md
    ↓ Reference for
ENGINE_API_REFERENCE.md
    ↓ Implemented by
ENGINE_IMPLEMENTATION_TEMPLATE.js
    ↓ Demonstrated by
ENGINE_TEMPLATE.html
```

---

## 📊 Comparison Table

| File | Purpose | Format | Time | Best For |
|------|---------|--------|------|----------|
| **CHEAT_SHEET** | Quick lookup | Markdown | 5m | Reference |
| **API_REFERENCE** | Learn API | Markdown + Code | 30m | Studying |
| **IMPLEMENTATION** | Build apps | JavaScript | 20m | Development |
| **TEMPLATE.html** | Test UI | Interactive | 5m | Testing |

---

## 🎓 Learning Path

### Beginner
```
1. Read: ENGINE_CHEAT_SHEET.md (5m)
   ↓
2. Read: ENGINE_API_REFERENCE.md (30m)
   ↓
3. Copy code from ENGINE_IMPLEMENTATION_TEMPLATE.js
   ↓
4. Test in ENGINE_TEMPLATE.html
```

### Intermediate
```
1. Reference: ENGINE_CHEAT_SHEET.md (as needed)
   ↓
2. Use: ENGINE_IMPLEMENTATION_TEMPLATE.js patterns
   ↓
3. Verify: ENGINE_TEMPLATE.html
```

### Advanced
```
1. Build on: ENGINE_IMPLEMENTATION_TEMPLATE.js
   ↓
2. Optimize: Using CHEAT_SHEET guide
   ↓
3. Deploy: With file sync enabled
```

---

## 🚨 Important Notes

### All Methods Are Async
```javascript
// ✓ CORRECT
const result = await db.execute("SELECT * FROM users");

// ✗ WRONG
const result = db.execute("SELECT * FROM users");
```

### Always Initialize First
```javascript
// ✓ CORRECT
const db = new CongoDB("myApp");
await db.initDB();
// Now use db methods

// ✗ WRONG
const db = new CongoDB("myApp");
await db.execute("SELECT * FROM users"); // No initDB!
```

### Use db.execute() for SQL
```javascript
// ✓ CORRECT - All SQL through execute()
await db.execute("INSERT INTO users (name) VALUES ('John')");

// ✗ WRONG - Don't use raw methods
await db.insertInto(...);  // These are internal
```

### Enable Sync Once
```javascript
// ✓ CORRECT
await db.enableRealTimeSync(fileHandle);
// All operations auto-sync now
await db.execute("INSERT...");

// ✗ WRONG
// Don't call enableRealTimeSync multiple times
await db.enableRealTimeSync(fileHandle1);
await db.enableRealTimeSync(fileHandle2); // Incorrect
```

---

## 🐛 Troubleshooting

### "Not initialized" Error
```javascript
// Solution: Call initDB() first
const db = new CongoDB("myApp");
await db.initDB();  // ← Add this
await db.execute("...");
```

### "File System Access API not supported"
```javascript
// Solution: Use modern browser
// Chrome 90+, Firefox 88+, Safari 15+
// Or use without file sync functionality
```

### "Database not found"
```javascript
// Solution: Create or switch database
await db.createDatabase("myApp");
await db.switchDatabase("myApp");
```

### "Table does not exist"
```javascript
// Solution: Create table first
await db.execute(`
  CREATE TABLE users (id INT PRIMARY KEY, name TEXT)
`);
```

---

## 📖 Documentation Map

```
START HERE
    ↓
ENGINE_CHEAT_SHEET.md (Methods overview)
    ↓
ENGINE_API_REFERENCE.md (Detailed docs + examples)
    ↓
ENGINE_IMPLEMENTATION_TEMPLATE.js (Code samples)
    ↓
ENGINE_TEMPLATE.html (Interactive testing)
    ↓
Build your own app!
```

---

## 🔍 Find What You Need

**"How do I create a table?"**
→ ENGINE_CHEAT_SHEET.md → "SQL Methods"
→ ENGINE_API_REFERENCE.md → "CREATE TABLE"

**"How do I export to CSV?"**
→ ENGINE_CHEAT_SHEET.md → "CSV/Excel Methods"
→ ENGINE_API_REFERENCE.md → "getTableCSVContent()"

**"How do I enable file sync?"**
→ ENGINE_CHEAT_SHEET.md → "Synchronization"
→ ENGINE_API_REFERENCE.md → "enableRealTimeSync()"

**"Show me a complete example"**
→ ENGINE_API_REFERENCE.md → "Complete Examples"
→ ENGINE_IMPLEMENTATION_TEMPLATE.js → Section 17

**"Where's the UI?"**
→ ENGINE_TEMPLATE.html → Open in browser

---

## ✅ Verification Checklist

Before building your app, verify:

- [ ] I've read ENGINE_CHEAT_SHEET.md
- [ ] I understand db.execute() for SQL
- [ ] I know the 7 main CRUD operations
- [ ] I can create and populate a table
- [ ] I can query and filter data
- [ ] I can export to CSV/Excel
- [ ] I can enable file sync
- [ ] I've tested in ENGINE_TEMPLATE.html

If all checked → Ready to build! 🚀

---

## 🎁 What You Can Build

With engine.js methods, you can build:

✓ Business applications (CRM, ERP)
✓ Content management systems (CMS)
✓ E-commerce platforms
✓ Project management tools
✓ Inventory systems
✓ Survey/feedback apps
✓ Analytics dashboards
✓ Data import/export tools
✓ Backup systems
✓ Offline-first apps

---

## 📞 Quick Help

| Question | Answer |
|----------|--------|
| Where's the main method? | `db.execute(sqlQuery)` |
| Do I need await? | Yes, all methods are async |
| Can I use raw SQL? | Yes, full SQL support |
| How do I enable sync? | `await db.enableRealTimeSync(fileHandle)` |
| Can I export? | Yes, CSV and Excel |
| Can I import? | Yes, all formats |
| Is it fast? | Yes, IndexedDB is optimized |
| Multiple databases? | Yes, `listDatabases()` |
| Persistent storage? | Yes, IndexedDB persists |

---

## 🚀 Ready to Build?

1. ✅ Read ENGINE_CHEAT_SHEET.md
2. ✅ Reference ENGINE_API_REFERENCE.md
3. ✅ Use ENGINE_IMPLEMENTATION_TEMPLATE.js
4. ✅ Test with ENGINE_TEMPLATE.html
5. ✅ Build your app!

**Start with ENGINE_CHEAT_SHEET.md right now!**

---

**All templates use ONLY methods defined in engine.js**
**No wrapper functions, no abstractions - just direct engine.js API**

**Last Updated: February 17, 2026**
