// routes/workorder.js
const express = require("express");
const router = express.Router();
const { Pool } = require("pg");

// ✅ Create connection pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: 5432,
});

// ==========================
// 1. Get All Work Orders
// ==========================
router.get("/api/work_orders", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT w.id, w.title, w.description, w.status, w.priority,
             c.first_name || ' ' || c.last_name AS contact_name
      FROM work_orders w
      LEFT JOIN contacts c ON w.contact_id = c.id
      ORDER BY w.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching work orders:", err);
    res.status(500).send("Server Error");
  }
});

// ==========================
// 2. Create New Work Order
// ==========================
router.post("/api/work_orders", async (req, res) => {
  try {
    const { title, description, status, priority, contact_id, created_by } = req.body;

    const result = await pool.query(
      `INSERT INTO work_orders 
        (title, description, status, priority, contact_id, created_by, updated_by) 
       VALUES ($1,$2,$3,$4,$5,$6,$6) 
       RETURNING *`,
      [title, description, status, priority, contact_id, created_by]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ Error creating work order:", err);
    res.status(500).send("Server Error");
  }
});

// ==========================
// 3. Get Single Work Order by ID
// ==========================
router.get("/api/work_orders:id", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT w.*, c.first_name || ' ' || c.last_name AS contact_name
       FROM work_orders w
       LEFT JOIN contacts c ON w.contact_id = c.id
       WHERE w.id = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ msg: "Work order not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ Error fetching work order:", err);
    res.status(500).send("Server Error");
  }
});

// ==========================
// 4. Update Work Order
// ==========================
router.put("/api/work_orders:id", async (req, res) => {
  try {
    const { title, description, status, priority, contact_id, updated_by } = req.body;

    const result = await pool.query(
      `UPDATE work_orders
       SET title=$1, description=$2, status=$3, priority=$4, contact_id=$5, updated_by=$6, updated_at=NOW()
       WHERE id=$7
       RETURNING *`,
      [title, description, status, priority, contact_id, updated_by, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ msg: "Work order not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ Error updating work order:", err);
    res.status(500).send("Server Error");
  }
});

// ==========================
// 5. Delete Work Order
// ==========================
router.delete("/api/work_orders/:id", async (req, res) => {
  try {
    const result = await pool.query(`DELETE FROM work_orders WHERE id=$1 RETURNING *`, [
      req.params.id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ msg: "Work order not found" });
    }

    res.json({ msg: "Work order deleted" });
  } catch (err) {
    console.error("❌ Error deleting work order:", err);
    res.status(500).send("Server Error");
  }
});

// ==========================
// 6. Fetch Contacts for Dropdown
// ==========================
router.get("/contacts/dropdown", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, first_name || ' ' || last_name AS name
       FROM contacts
       ORDER BY first_name ASC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching contacts:", err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
