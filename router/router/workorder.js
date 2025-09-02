// // // routes/workorder.js
// // const express = require("express");
// // const router = express.Router();
// // const { Pool } = require("pg");

// // // Create PostgreSQL connection pool
// // const pool = new Pool({
// //   user: process.env.DB_USER,
// //   host: process.env.DB_HOST,
// //   database: process.env.DB_NAME,
// //   password: process.env.DB_PASS,
// //   port: 5432,
// // });

// // // ----------------------
// // // Work Orders CRUD
// // // ----------------------

// // // Get all work orders
// // router.get("/api/work_orders", async (req, res) => {
// //   try {
// //     const result = await pool.query(`
// //       SELECT w.*, 
// //              c.first_name || ' ' || c.last_name AS contact_name
// //       FROM work_orders w
// //       LEFT JOIN contacts c ON w.customer_contact_id = c.id
// //       ORDER BY w.created_at DESC
// //     `);
// //     res.json(result.rows);
// //   } catch (err) {
// //     console.error("Error fetching work orders:", err);
// //     res.status(500).send("Server Error");
// //   }
// // });

// // // Get single work order by ID
// // router.get("/api/work_orders/:id", async (req, res) => {
// //   try {
// //     const result = await pool.query(
// //       `SELECT w.*, c.first_name || ' ' || c.last_name AS contact_name
// //        FROM work_orders w
// //        LEFT JOIN contacts c ON w.customer_contact_id = c.id
// //        WHERE w.id = $1`,
// //       [req.params.id]
// //     );
// //     if (!result.rows.length) return res.status(404).json({ msg: "Work order not found" });
// //     res.json(result.rows[0]);
// //   } catch (err) {
// //     console.error("Error fetching work order:", err);
// //     res.status(500).send("Server Error");
// //   }
// // });

// // // Create new work order
// // router.post("/api/work_orders", async (req, res) => {
// //   try {
// //     const {
// //       organization_id,
// //       work_order_number,
// //       title,
// //       description,
// //       long_description,
// //       status_id,
// //       priority_id,
// //       type_id,
// //       customer_id,
// //       asset_id,
// //       customer_contact_id,
// //       estimated_duration,
// //       actual_start_date,
// //       completion_date,
// //       assigned_to,
// //       supervisor_id,
// //       labor_hours,
// //       notes,
// //       attachments,
// //       scheduled_at,
// //       created_by,
// //       updated_by
// //     } = req.body;

// //     const result = await pool.query(
// //       `INSERT INTO work_orders
// //        (organization_id, work_order_number, title, description, long_description,
// //         status_id, priority_id, type_id, customer_id, asset_id, customer_contact_id,
// //         estimated_duration, actual_start_date, completion_date, assigned_to, supervisor_id,
// //         labor_hours, notes, attachments, scheduled_at, created_by, updated_by)
// //        VALUES
// //        ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22)
// //        RETURNING *`,
// //       [
// //         organization_id, work_order_number, title, description, long_description,
// //         status_id, priority_id, type_id, customer_id, asset_id, customer_contact_id,
// //         estimated_duration, actual_start_date, completion_date, assigned_to, supervisor_id,
// //         labor_hours, notes, attachments, scheduled_at, created_by, updated_by
// //       ]
// //     );
// //     res.json(result.rows[0]);
// //   } catch (err) {
// //     console.error("Error creating work order:", err);
// //     res.status(500).send("Server Error");
// //   }
// // });

// // // Update work order
// // router.put("/api/work_orders/:id", async (req, res) => {
// //   try {
// //     const {
// //       organization_id,
// //       work_order_number,
// //       title,
// //       description,
// //       long_description,
// //       status_id,
// //       priority_id,
// //       type_id,
// //       customer_id,
// //       asset_id,
// //       customer_contact_id,
// //       estimated_duration,
// //       actual_start_date,
// //       completion_date,
// //       assigned_to,
// //       supervisor_id,
// //       labor_hours,
// //       notes,
// //       attachments,
// //       scheduled_at,
// //       updated_by
// //     } = req.body;

// //     const result = await pool.query(
// //       `UPDATE work_orders
// //        SET organization_id=$1, work_order_number=$2, title=$3, description=$4, long_description=$5,
// //            status_id=$6, priority_id=$7, type_id=$8, customer_id=$9, asset_id=$10, customer_contact_id=$11,
// //            estimated_duration=$12, actual_start_date=$13, completion_date=$14, assigned_to=$15,
// //            supervisor_id=$16, labor_hours=$17, notes=$18, attachments=$19, scheduled_at=$20,
// //            updated_by=$21, updated_at=NOW()
// //        WHERE id=$22
// //        RETURNING *`,
// //       [
// //         organization_id, work_order_number, title, description, long_description,
// //         status_id, priority_id, type_id, customer_id, asset_id, customer_contact_id,
// //         estimated_duration, actual_start_date, completion_date, assigned_to, supervisor_id,
// //         labor_hours, notes, attachments, scheduled_at, updated_by, req.params.id
// //       ]
// //     );

// //     if (!result.rows.length) return res.status(404).json({ msg: "Work order not found" });
// //     res.json(result.rows[0]);
// //   } catch (err) {
// //     console.error("Error updating work order:", err);
// //     res.status(500).send("Server Error");
// //   }
// // });

// // // Delete work order
// // router.delete("/api/work_orders/:id", async (req, res) => {
// //   try {
// //     const result = await pool.query(`DELETE FROM work_orders WHERE id=$1 RETURNING *`, [req.params.id]);
// //     if (!result.rows.length) return res.status(404).json({ msg: "Work order not found" });
// //     res.json({ msg: "Work order deleted" });
// //   } catch (err) {
// //     console.error("Error deleting work order:", err);
// //     res.status(500).send("Server Error");
// //   }
// // });

// // // ----------------------
// // // Dropdown Endpoints
// // // ----------------------

// // // Work Order Types
// // router.get("/api/work_order_types", async (req, res) => {
// //   try {
// //     const result = await pool.query(`SELECT id, name FROM work_order_types ORDER BY name ASC`);
// //     res.json(result.rows);
// //   } catch (err) {
// //     console.error("Error fetching work order types:", err);
// //     res.status(500).send("Server Error");
// //   }
// // });

// // // Work Order Status
// // router.get("/api/work_order_statuses", async (req, res) => {
// //   try {
// //     const result = await pool.query(`SELECT id, name FROM work_order_status ORDER BY name ASC`);
// //     res.json(result.rows);
// //   } catch (err) {
// //     console.error("Error fetching work order statuses:", err);
// //     res.status(500).send("Server Error");
// //   }
// // });

// // // Work Order Priorities
// // router.get("/api/work_order_priorities", async (req, res) => {
// //   try {
// //     const result = await pool.query(`SELECT id, name FROM work_order_priority ORDER BY name ASC`);
// //     res.json(result.rows);
// //   } catch (err) {
// //     console.error("Error fetching work order priorities:", err);
// //     res.status(500).send("Server Error");
// //   }
// // });

// // module.exports = router;



// // // // routes/workorder.js
// // // const express = require("express");
// // // const router = express.Router();
// // // const pool = require("../db"); // ✅ use shared db connection

// // // // ----------------------
// // // // Work Orders CRUD
// // // // ----------------------

// // // // Get all work orders
// // // router.get("/api/work_orders", async (req, res) => {
// // //   try {
// // //     const result = await pool.query(`
// // //       SELECT w.*, 
// // //              c.first_name || ' ' || c.last_name AS contact_name
// // //       FROM work_orders w
// // //       LEFT JOIN contacts c ON w.customer_contact_id = c.id
// // //       ORDER BY w.created_at DESC
// // //     `);
// // //     res.json(result.rows);
// // //   } catch (err) {
// // //     console.error("Error fetching work orders:", err.message);
// // //     res.status(500).json({ error: "Failed to fetch work orders" });
// // //   }
// // // });

// // // // Get single work order by ID
// // // router.get("/api/work_orders/:id", async (req, res) => {
// // //   try {
// // //     const result = await pool.query(
// // //       `SELECT w.*, c.first_name || ' ' || c.last_name AS contact_name
// // //        FROM work_orders w
// // //        LEFT JOIN contacts c ON w.customer_contact_id = c.id
// // //        WHERE w.id = $1`,
// // //       [req.params.id]
// // //     );
// // //     if (!result.rows.length) return res.status(404).json({ error: "Work order not found" });
// // //     res.json(result.rows[0]);
// // //   } catch (err) {
// // //     console.error("Error fetching work order:", err.message);
// // //     res.status(500).json({ error: "Failed to fetch work order" });
// // //   }
// // // });

// // // // Create new work order
// // // router.post("/api/work_orders", async (req, res) => {
// // //   try {
// // //     const {
// // //       organization_id,
// // //       work_order_number,
// // //       title,
// // //       description,
// // //       long_description,
// // //       status_id,
// // //       priority_id,
// // //       type_id,
// // //       customer_id,
// // //       asset_id,
// // //       customer_contact_id,
// // //       estimated_duration,
// // //       actual_start_date,
// // //       completion_date,
// // //       assigned_to,
// // //       supervisor_id,
// // //       labor_hours,
// // //       notes,
// // //       attachments,
// // //       scheduled_at,
// // //       created_by,
// // //       updated_by
// // //     } = req.body;

// // //     const result = await pool.query(
// // //       `INSERT INTO work_orders
// // //        (organization_id, work_order_number, title, description, long_description,
// // //         status_id, priority_id, type_id, customer_id, asset_id, customer_contact_id,
// // //         estimated_duration, actual_start_date, completion_date, assigned_to, supervisor_id,
// // //         labor_hours, notes, attachments, scheduled_at, created_by, updated_by)
// // //        VALUES
// // //        ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22)
// // //        RETURNING *`,
// // //       [
// // //         organization_id, work_order_number, title, description, long_description,
// // //         status_id, priority_id, type_id, customer_id, asset_id, customer_contact_id,
// // //         estimated_duration, actual_start_date, completion_date, assigned_to, supervisor_id,
// // //         labor_hours, notes, attachments, scheduled_at, created_by, updated_by
// // //       ]
// // //     );
// // //     res.status(201).json(result.rows[0]);
// // //   } catch (err) {
// // //     console.error("Error creating work order:", err.message);
// // //     res.status(500).json({ error: "Failed to create work order" });
// // //   }
// // // });

// // // // Update work order
// // // router.put("/api/work_orders/:id", async (req, res) => {
// // //   try {
// // //     const {
// // //       organization_id,
// // //       work_order_number,
// // //       title,
// // //       description,
// // //       long_description,
// // //       status_id,
// // //       priority_id,
// // //       type_id,
// // //       customer_id,
// // //       asset_id,
// // //       customer_contact_id,
// // //       estimated_duration,
// // //       actual_start_date,
// // //       completion_date,
// // //       assigned_to,
// // //       supervisor_id,
// // //       labor_hours,
// // //       notes,
// // //       attachments,
// // //       scheduled_at,
// // //       updated_by
// // //     } = req.body;

// // //     const result = await pool.query(
// // //       `UPDATE work_orders
// // //        SET organization_id=$1, work_order_number=$2, title=$3, description=$4, long_description=$5,
// // //            status_id=$6, priority_id=$7, type_id=$8, customer_id=$9, asset_id=$10, customer_contact_id=$11,
// // //            estimated_duration=$12, actual_start_date=$13, completion_date=$14, assigned_to=$15,
// // //            supervisor_id=$16, labor_hours=$17, notes=$18, attachments=$19, scheduled_at=$20,
// // //            updated_by=$21, updated_at=NOW()
// // //        WHERE id=$22
// // //        RETURNING *`,
// // //       [
// // //         organization_id, work_order_number, title, description, long_description,
// // //         status_id, priority_id, type_id, customer_id, asset_id, customer_contact_id,
// // //         estimated_duration, actual_start_date, completion_date, assigned_to, supervisor_id,
// // //         labor_hours, notes, attachments, scheduled_at, updated_by, req.params.id
// // //       ]
// // //     );

// // //     if (!result.rows.length) return res.status(404).json({ error: "Work order not found" });
// // //     res.json(result.rows[0]);
// // //   } catch (err) {
// // //     console.error("Error updating work order:", err.message);
// // //     res.status(500).json({ error: "Failed to update work order" });
// // //   }
// // // });

// // // // Delete work order
// // // router.delete("/api/work_orders/:id", async (req, res) => {
// // //   try {
// // //     const result = await pool.query(`DELETE FROM work_orders WHERE id=$1 RETURNING *`, [req.params.id]);
// // //     if (!result.rows.length) return res.status(404).json({ error: "Work order not found" });
// // //     res.json({ message: "Work order deleted" });
// // //   } catch (err) {
// // //     console.error("Error deleting work order:", err.message);
// // //     res.status(500).json({ error: "Failed to delete work order" });
// // //   }
// // // });

// // // // ----------------------
// // // // Dropdown Endpoints
// // // // ----------------------

// // // router.get("api/work_order_types", async (req, res) => {
// // //   try {
// // //     const result = await pool.query(`SELECT id, name FROM work_order_types ORDER BY name ASC`);
// // //     res.json(result.rows);
// // //   } catch (err) {
// // //     console.error("Error fetching work order types:", err.message);
// // //     res.status(500).json({ error: "Failed to fetch work order types" });
// // //   }
// // // });

// // // router.get("/api/work_order_statuses", async (req, res) => {
// // //   try {
// // //     const result = await pool.query(`SELECT id, name FROM work_order_status ORDER BY name ASC`);
// // //     res.json(result.rows);
// // //   } catch (err) {
// // //     console.error("Error fetching work order statuses:", err.message);
// // //     res.status(500).json({ error: "Failed to fetch work order statuses" });
// // //   }
// // // });

// // // router.get("/api/work_order_priorities", async (req, res) => {
// // //   try {
// // //     const result = await pool.query(`SELECT id, name FROM work_order_priority ORDER BY name ASC`);
// // //     res.json(result.rows);
// // //   } catch (err) {
// // //     console.error("Error fetching work order priorities:", err.message);
// // //     res.status(500).json({ error: "Failed to fetch work order priorities" });
// // //   }
// // // });

// // // module.exports = router;
// // // // // routes/workorder.js
// // // // const express = require("express");
// // // // const router = express.Router();
// // // // const { Pool } = require("pg");

// // // // // PostgreSQL connection pool
// // // // const pool = new Pool({
// // // //   user: process.env.DB_USER,
// // // //   host: process.env.DB_HOST,
// // // //   database: process.env.DB_NAME,
// // // //   password: process.env.DB_PASS,
// // // //   port: 5432,
// // // // });

// // // // // ====== WORK ORDER TYPES ======
// // // // router.get("/types", async (req, res) => {
// // // //   try {
// // // //     const result = await pool.query("SELECT id, name FROM work_order_types ORDER BY name");
// // // //     res.json(result.rows);
// // // //   } catch (err) {
// // // //     console.error(err);
// // // //     res.status(500).json({ error: "Failed to fetch work order types" });
// // // //   }
// // // // });

// // // // // ====== WORK ORDER STATUSES ======
// // // // router.get("/statuses", async (req, res) => {
// // // //   try {
// // // //     const result = await pool.query("SELECT id, name FROM work_order_statuses ORDER BY name");
// // // //     res.json(result.rows);
// // // //   } catch (err) {
// // // //     console.error(err);
// // // //     res.status(500).json({ error: "Failed to fetch work order statuses" });
// // // //   }
// // // // });

// // // // // ====== WORK ORDER PRIORITIES ======
// // // // router.get("/priorities", async (req, res) => {
// // // //   try {
// // // //     const result = await pool.query("SELECT id, name FROM work_order_priorities ORDER BY name");
// // // //     res.json(result.rows);
// // // //   } catch (err) {
// // // //     console.error(err);
// // // //     res.status(500).json({ error: "Failed to fetch work order priorities" });
// // // //   }
// // // // });

// // // // // ====== USERS ======
// // // // router.get("/users", async (req, res) => {
// // // //   try {
// // // //     const result = await pool.query("SELECT id, username FROM users ORDER BY username");
// // // //     res.json(result.rows);
// // // //   } catch (err) {
// // // //     console.error(err);
// // // //     res.status(500).json({ error: "Failed to fetch users" });
// // // //   }
// // // // });

// // // // // ====== CREATE WORK ORDER ======
// // // // router.post("/", async (req, res) => {
// // // //   try {
// // // //     const data = req.body;

// // // //     const query = `
// // // //       INSERT INTO work_orders (
// // // //         organization_id, work_order_number, title, description, long_description,
// // // //         status_id, priority_id, type_id, customer_id, asset_id, customer_contact_id,
// // // //         estimated_duration, actual_start_date, completion_date, assigned_to, supervisor_id,
// // // //         labor_hours, failure_code_id, resolution_code_id, billing_status_id, total_cost,
// // // //         notes, attachments, scheduled_at, created_by, updated_by
// // // //       )
// // // //       VALUES (
// // // //         $1,$2,$3,$4,$5,
// // // //         $6,$7,$8,$9,$10,$11,
// // // //         $12,$13,$14,$15,$16,
// // // //         $17,$18,$19,$20,$21,
// // // //         $22,$23,$24,$25,$26
// // // //       )
// // // //       RETURNING id
// // // //     `;

// // // //     const values = [
// // // //       data.organization_id, data.work_order_number, data.title, data.description, data.long_description,
// // // //       data.status_id, data.priority_id, data.type_id, data.customer_id, data.asset_id, data.customer_contact_id,
// // // //       data.estimated_duration, data.actual_start_date, data.completion_date, data.assigned_to, data.supervisor_id,
// // // //       data.labor_hours, data.failure_code_id, data.resolution_code_id, data.billing_status_id, data.total_cost,
// // // //       data.notes, data.attachments, data.scheduled_at, data.created_by, data.updated_by
// // // //     ];

// // // //     const result = await pool.query(query, values);
// // // //     res.json({ id: result.rows[0].id });
// // // //   } catch (err) {
// // // //     console.error(err);
// // // //     res.status(500).json({ error: "Failed to create work order" });
// // // //   }
// // // // });

// // // // module.exports = router;
// // backend/index.js
// const express = require("express");
// const workorderRouter = require("./router/workorder"); // Corrected path
// const app = express();
// app.use(express.json());
// // backend/db.js
// const { Pool } = require("pg");

// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASS,
//   port: 5432,
// }); // Ensure this points to your database configuration

// // ----------------------
// // Work Orders CRUD
// // ----------------------

// // Get all work orders
// router.get("/api/work_orders", async (req, res) => {
//   try {
//     const result = await pool.query(`
//       SELECT w.*, 
//              c.first_name || ' ' || c.last_name AS contact_name
//       FROM work_orders w
//       LEFT JOIN contacts c ON w.customer_contact_id = c.id
//       ORDER BY w.created_at DESC
//     `);
//     res.json(result.rows);
//   } catch (err) {
//     console.error("Error fetching work orders:", err.message);
//     res.status(500).json({ error: "Failed to fetch work orders" });
//   }
// });

// // Get single work order by ID
// router.get("/api/work_orders/:id", async (req, res) => {
//   try {
//     const result = await pool.query(
//       `SELECT w.*, c.first_name || ' ' || c.last_name AS contact_name
//        FROM work_orders w
//        LEFT JOIN contacts c ON w.customer_contact_id = c.id
//        WHERE w.id = $1`,
//       [req.params.id]
//     );
//     if (!result.rows.length) return res.status(404).json({ error: "Work order not found" });
//     res.json(result.rows[0]);
//   } catch (err) {
//     console.error("Error fetching work order:", err.message);
//     res.status(500).json({ error: "Failed to fetch work order" });
//   }
// });

// // Create new work order
// router.post("/api/work_orders", async (req, res) => {
//   try {
//     const {
//       organization_id,
//       work_order_number,
//       title,
//       description,
//       long_description,
//       status_id,
//       priority_id,
//       type_id,
//       customer_id,
//       asset_id,
//       customer_contact_id,
//       estimated_duration,
//       actual_start_date,
//       completion_date,
//       assigned_to,
//       supervisor_id,
//       labor_hours,
//       notes,
//       attachments,
//       scheduled_at,
//       created_by,
//       updated_by
//     } = req.body;

//     const result = await pool.query(
//       `INSERT INTO work_orders
//        (organization_id, work_order_number, title, description, long_description,
//         status_id, priority_id, type_id, customer_id, asset_id, customer_contact_id,
//         estimated_duration, actual_start_date, completion_date, assigned_to, supervisor_id,
//         labor_hours, notes, attachments, scheduled_at, created_by, updated_by)
//        VALUES
//        ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22)
//        RETURNING *`,
//       [
//         organization_id, work_order_number, title, description, long_description,
//         status_id, priority_id, type_id, customer_id, asset_id, customer_contact_id,
//         estimated_duration, actual_start_date, completion_date, assigned_to, supervisor_id,
//         labor_hours, notes, attachments, scheduled_at, created_by, updated_by
//       ]
//     );
//     res.status(201).json(result.rows[0]);
//   } catch (err) {
//     console.error("Error creating work order:", err.message);
//     res.status(500).json({ error: "Failed to create work order" });
//   }
// });

// // Update work order
// router.put("/api/work_orders/:id", async (req, res) => {
//   try {
//     const {
//       organization_id,
//       work_order_number,
//       title,
//       description,
//       long_description,
//       status_id,
//       priority_id,
//       type_id,
//       customer_id,
//       asset_id,
//       customer_contact_id,
//       estimated_duration,
//       actual_start_date,
//       completion_date,
//       assigned_to,
//       supervisor_id,
//       labor_hours,
//       notes,
//       attachments,
//       scheduled_at,
//       updated_by
//     } = req.body;

//     const result = await pool.query(
//       `UPDATE work_orders
//        SET organization_id=$1, work_order_number=$2, title=$3, description=$4, long_description=$5,
//            status_id=$6, priority_id=$7, type_id=$8, customer_id=$9, asset_id=$10, customer_contact_id=$11,
//            estimated_duration=$12, actual_start_date=$13, completion_date=$14, assigned_to=$15,
//            supervisor_id=$16, labor_hours=$17, notes=$18, attachments=$19, scheduled_at=$20,
//            updated_by=$21, updated_at=NOW()
//        WHERE id=$22
//        RETURNING *`,
//       [
//         organization_id, work_order_number, title, description, long_description,
//         status_id, priority_id, type_id, customer_id, asset_id, customer_contact_id,
//         estimated_duration, actual_start_date, completion_date, assigned_to, supervisor_id,
//         labor_hours, notes, attachments, scheduled_at, updated_by, req.params.id
//       ]
//     );

//     if (!result.rows.length) return res.status(404).json({ error: "Work order not found" });
//     res.json(result.rows[0]);
//   } catch (err) {
//     console.error("Error updating work order:", err.message);
//     res.status(500).json({ error: "Failed to update work order" });
//   }
// });

// // Delete work order
// router.delete("/api/work_orders/:id", async (req, res) => {
//   try {
//     const result = await pool.query(`DELETE FROM work_orders WHERE id=$1 RETURNING *`, [req.params.id]);
//     if (!result.rows.length) return res.status(404).json({ error: "Work order not found" });
//     res.json({ message: "Work order deleted" });
//   } catch (err) {
//     console.error("Error deleting work order:", err.message);
//     res.status(500).json({ error: "Failed to delete work order" });
//   }
// });

// // ----------------------
// // Dropdown Endpoints
// // ----------------------

// // Work Order Types
// router.get("/api/work_order_types", async (req, res) => {
//   try {
//     const result = await pool.query(`SELECT id, name FROM work_order_types ORDER BY name ASC`);
//     res.json(result.rows);
//   } catch (err) {
//     console.error("Error fetching work order types:", err.message);
//     res.status(500).json({ error: "Failed to fetch work order types" });
//   }
// });

// // Work Order Statuses
// router.get("/api/work_order_statuses", async (req, res) => {
//   try {
//     const result = await pool.query(`SELECT id, name FROM work_order_status ORDER BY name ASC`);
//     res.json(result.rows);
//   } catch (err) {
//     console.error("Error fetching work order statuses:", err.message);
//     res.status(500).json({ error: "Failed to fetch work order statuses" });
//   }
// });

// // Work Order Priorities
// router.get("/api/work_order_priorities", async (req, res) => {
//   try {
//     const result = await pool.query(`SELECT id, name FROM work_order_priority ORDER BY name ASC`);
//     res.json(result.rows);
//   } catch (err) {
//     console.error("Error fetching work order priorities:", err.message);
//     res.status(500).json({ error: "Failed to fetch work order priorities" });
//   }
// });

// module.exports = router;