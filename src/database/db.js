import * as SQLite from 'expo-sqlite';

let db;

export function getDB() {
  if (!db) {
    db = SQLite.openDatabaseSync('library.db');
  }
  return db;
}

export function initDB() {
  const db = getDB();

  // Create tables
  db.execSync(`PRAGMA journal_mode = WAL;`);

  // Force reset for mock data update
  db.execSync(`DROP TABLE IF EXISTS transactions;`);
  db.execSync(`DROP TABLE IF EXISTS books;`);
  db.execSync(`DROP TABLE IF EXISTS users;`);

  db.execSync(`
    CREATE TABLE IF NOT EXISTS users (
      user_id   INTEGER PRIMARY KEY AUTOINCREMENT,
      username  TEXT NOT NULL UNIQUE,
      password  TEXT NOT NULL,
      role      TEXT NOT NULL DEFAULT 'member'
    );
  `);

  db.execSync(`
    CREATE TABLE IF NOT EXISTS books (
      book_id  INTEGER PRIMARY KEY AUTOINCREMENT,
      title    TEXT NOT NULL,
      status   TEXT NOT NULL DEFAULT 'available'
    );
  `);

  db.execSync(`
    CREATE TABLE IF NOT EXISTS transactions (
      transaction_id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id        INTEGER NOT NULL REFERENCES users(user_id),
      book_id        INTEGER NOT NULL REFERENCES books(book_id),
      borrow_date    TEXT NOT NULL,
      return_date    TEXT,
      status         TEXT NOT NULL DEFAULT 'borrowing'
    );
  `);

  seedData(db);
}

function seedData(db) {
  // Check if already seeded
  const userCount = db.getFirstSync('SELECT COUNT(*) as count FROM users');
  if (userCount.count > 0) return;

  // Seed users
  db.execSync(`
    INSERT INTO users (username, password, role) VALUES
      ('admin', 'admin1234', 'admin'),
      ('user1', 'pass1234', 'member'),
      ('user2', 'pass1234', 'member');
  `);

  // Seed books
  db.execSync(`
    INSERT INTO books (title, status) VALUES
      ('การพัฒนาแอปพลิเคชันด้วย React Native', 'available'),
      ('เรียนรู้ภาษา Python 3 ฉบับสมบูรณ์', 'available'),
      ('การออกแบบ UI/UX ขั้นพื้นฐาน', 'available'),
      ('โครงสร้างข้อมูลและอัลกอริทึม', 'available');
  `);
}

// ─── User queries ─────────────────────────────────────────────
export function loginUser(username, password) {
  const db = getDB();
  return db.getFirstSync(
    'SELECT * FROM users WHERE username = ? AND password = ?',
    [username, password]
  );
}

export function registerUser(username, password) {
  const db = getDB();
  try {
    db.runSync(
      'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
      [username, password, 'member']
    );
    return { success: true };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

export function getAllUsers() {
  const db = getDB();
  return db.getAllSync('SELECT user_id, username, role FROM users ORDER BY user_id');
}

// ─── Book queries ─────────────────────────────────────────────
export function getAllBooks() {
  const db = getDB();
  return db.getAllSync('SELECT * FROM books ORDER BY book_id');
}

export function addBook(title) {
  const db = getDB();
  db.runSync('INSERT INTO books (title, status) VALUES (?, ?)', [title, 'available']);
}

export function getBookById(bookId) {
  const db = getDB();
  return db.getFirstSync('SELECT * FROM books WHERE book_id = ?', [bookId]);
}

// ─── Transaction queries ──────────────────────────────────────
export function borrowBook(userId, bookId) {
  const db = getDB();
  const book = getBookById(bookId);
  if (!book || book.status !== 'available') {
    return { success: false, error: 'หนังสือเล่มนี้ถูกยืมไปแล้ว ไม่สามารถยืมได้' };
  }
  const now = new Date().toISOString();
  db.runSync(
    'INSERT INTO transactions (user_id, book_id, borrow_date, status) VALUES (?, ?, ?, ?)',
    [userId, bookId, now, 'borrowing']
  );
  db.runSync("UPDATE books SET status = 'borrowed' WHERE book_id = ?", [bookId]);
  return { success: true };
}

export function returnBook(transactionId, bookId) {
  const db = getDB();
  const now = new Date().toISOString();
  db.runSync(
    "UPDATE transactions SET return_date = ?, status = 'returned' WHERE transaction_id = ?",
    [now, transactionId]
  );
  db.runSync("UPDATE books SET status = 'available' WHERE book_id = ?", [bookId]);
  return { success: true };
}

export function getUserTransactions(userId) {
  const db = getDB();
  return db.getAllSync(
    `SELECT t.*, b.title FROM transactions t
     JOIN books b ON t.book_id = b.book_id
     WHERE t.user_id = ?
     ORDER BY t.transaction_id DESC`,
    [userId]
  );
}

export function getBorrowingByUser(userId) {
  const db = getDB();
  return db.getAllSync(
    `SELECT t.*, b.title FROM transactions t
     JOIN books b ON t.book_id = b.book_id
     WHERE t.user_id = ? AND t.status = 'borrowing'`,
    [userId]
  );
}

export function getAllBorrowedBooks() {
  const db = getDB();
  return db.getAllSync(
    `SELECT t.transaction_id, b.title, u.username, t.borrow_date
     FROM transactions t
     JOIN books b ON t.book_id = b.book_id
     JOIN users u ON t.user_id = u.user_id
     WHERE t.status = 'borrowing'
     ORDER BY t.borrow_date DESC`
  );
}
