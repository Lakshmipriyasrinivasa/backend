// // schedule.js
// const express = require("express");
// const router = express.Router();

// module.exports = (pool) => {
//   // ================== USERS ==================
//   router.get("/users", async (req, res) => {
//     try {
//       const result = await pool.query("SELECT id, username FROM users");
//       res.json(result.rows);
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: "Failed to fetch users" });
//     }
//   });

//   // ================== WORK ORDER TYPES ==================
//   router.get("/work_order_types", async (req, res) => {
//     try {
//       const result = await pool.query("SELECT id, name FROM work_order_types");
//       res.json(result.rows);
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: "Failed to fetch work order types" });
//     }
//   });

//   // ================== WORK ORDER STATUS ==================
//   router.get("/work_order_status", async (req, res) => {
//     try {
//       const result = await pool.query("SELECT id, name FROM work_order_status");
//       res.json(result.rows);
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: "Failed to fetch work order status" });
//     }
//   });

//   // ================== SCHEDULE ==================
//   router.get("/schedule", async (req, res) => {
//     try {
//       const result = await pool.query(`
//         SELECT s.id, s.title, s.start_time, s.end_time, s.type_id, s.status_id, s.employee_id,
//                u.username as employee, wt.name as type, ws.name as status
//         FROM schedule s
//         LEFT JOIN users u ON s.employee_id = u.id
//         LEFT JOIN work_order_types wt ON s.type_id = wt.id
//         LEFT JOIN work_order_status ws ON s.status_id = ws.id
//         ORDER BY s.start_time ASC
//       `);
//       res.json(result.rows);
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: "Failed to fetch schedules" });
//     }
//   });

//   // POST new schedule
//   router.post("/schedule", async (req, res) => {
//     try {
//       const { title, start_time, end_time, type_id, status_id, employee_id } = req.body;

//       const result = await pool.query(
//         `INSERT INTO schedule (title, start_time, end_time, type_id, status_id, employee_id)
//          VALUES ($1, $2, $3, $4, $5, $6)
//          RETURNING *`,
//         [title, start_time, end_time, type_id, status_id, employee_id]
//       );

//       res.status(201).json(result.rows[0]);
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: "Failed to create schedule" });
//     }
//   });

//   return router;
// };
