// const express = require("express");
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const { Pool } = require('pg');
// require('dotenv').config();

// const app = express();
// app.use(cors());
// app.use(express.json());
// app.use(bodyParser.json());


// // PostgreSQL connection
// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASS,
//   port: 5432,
// });
// // default route
// app.get('/', (req, res) => {
//   res.send('Backend API is running ✅');
// });


// // Test route
// app.get('/api/workers', async (req, res) => {
//   try {
//     const result = await pool.query('SELECT * FROM workers');
//     res.json(result.rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Server error');
//   }
// });

// app.get('/api/workerforce', async (req, res) => {
//   try {
//     const result = await pool.query('SELECT * FROM workerforce');
//     res.json(result.rows);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });


// // Add worker
// app.post('/api/workers', async (req, res) => {
//   const { name, email, role } = req.body;
//   try {
//     await pool.query('INSERT INTO workers (name, email, role) VALUES ($1, $2, $3)', [name, email, role]);
//     res.status(201).send('Worker added');
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Server error');
//   }
// });


// // Add new workforce
// app.post('/api/workerforce', async (req, res) => {
//   const {
//     full_name, dob, gender, mobile, alt_mobile, email,
//     emergency_name, emergency_phone, current_address, permanent_address,
//     city, state, country, gov_id, skills, availability, work_location, gps, medical
//   } = req.body;

//   try {
//   await pool.query(
//   `INSERT INTO workerforce (
//     full_name, dob, gender, mobile, alt_mobile, email,
//     emergency_name, emergency_phone, current_address, permanent_address,
//     city, state, country, gov_id, skills, availability, work_location, gps, medical
//   ) VALUES (
//     $1, $2, $3, $4, $5, $6,
//     $7, $8, $9, $10,
//     $11, $12, $13, $14, $15, $16,
//     $17, $18, $19
//   )`,
//   [
//     full_name, dob, gender, mobile, alt_mobile, email,
//     emergency_name, emergency_phone, current_address, permanent_address,
//     city, state, country, gov_id, skills, availability, work_location, gps, medical
//   ]
// );

// res.status(201).json({ message: 'Workforce member added' });
//   } catch (err) {
//     console.error(err);
// res.status(500).json({ error: 'Server error' });  }
// });

// app.listen(5000, () => console.log('Server running on port 5000'));
const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();
// const bcrypt = require("bcryptjs"); // works reliably on all systems
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// PostgreSQL connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: 5432,
});

pool.connect()
  .then(() => console.log("✅ PostgreSQL connected"))
  .catch(err => console.error("❌ DB connection error:", err));

// const workorderRouter = require("./router/workorder"); // Path relative to index.jsapp.use("/api", workorderRouter);
// app.use("/api", workorderRouter);

// const scheduleRouter = require("./schedule");
// app.use("/api", scheduleRouter(pool));


// Default route
app.get('/', (req, res) => {
  res.send('Backend API is running ✅');
});

// Test route
app.get('/api/workers', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM workers');
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching workers:", err);
    res.status(500).send('Server error');
  }
});

app.get('/api/workerforce', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM workerforce'); // Table name confirmed
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching workerforce:", err);
    res.status(500).json({ error: err.message });
  }
});
app.get("/api/accounts", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM accounts ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching accounts:", err);
    res.status(500).json({ error: "Failed to fetch accounts" });
  }
});
app.get("/api/newassets", async (_req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM public.newassets ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("⚠️ Error fetching newassets:", err);
    res.status(500).json({ error: "Failed to fetch assets" });
  }
});
app.get("/api/service-contracts", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM service_contracts ORDER BY id DESC");
    res.json({ success: true, contracts: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});
  // contact asset refer
app.get("/api/contacts/dropdown", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, first_name, last_name FROM contacts ORDER BY first_name ASC`
    );
    const contacts = result.rows.map(c => ({
      id: c.id,
      name: `${c.first_name || ""} ${c.last_name || ""}`.trim()
    }));
    res.json(contacts);
  } catch (err) {
    console.error("Error fetching contacts for dropdown:", err.message);
    res.status(500).json({ error: "Failed to fetch contacts" });
  }
});

// contact refer user
app.get("/api/users/dropdown", async (req, res) => {
  const users = await pool.query("SELECT id, first_name || ' ' || last_name AS name FROM users");
  res.json(users.rows);
});
// contact refer org
// Fetch all organizations
app.get("/api/organizations", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM organizations ORDER BY name ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching organizations:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});


app.get("/api/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Database error" });
  }
});
// server.js or routes/contact.js
app.get("/api/contacts", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM contacts ORDER BY first_name ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching contacts:", err.message);
    res.status(500).json({ error: "Failed to fetch contacts" });
  }
});

// Get all fields
app.get("/api/fields", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM fields ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch fields" });
  }
});

// --- Get all inventory items ---
app.get('/api/inventory', async (req, res) => {
  try {
    const sql = `
      SELECT 
        i.*, 
        o.name AS organization_name
      FROM inventory i
      LEFT JOIN organizations o ON i.org_id = o.id
      ORDER BY i.item_id DESC
    `;
    const result = await pool.query(sql);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching inventory:", err);
    res.status(500).json({ error: err.message });
  }
});

// // GET /users - fetch all users
// app.get('/api/login', async (req, res) => {
//   try {
// const result = await pool.query(
//       "SELECT id, email, password_hash, FROM users WHERE deleted_at IS NULL"
//       [email]

// );
//     res.json(result.rows);
//   } catch (error) {
//     console.error("Error fetching users:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });





// Add worker
app.post('/api/workers', async (req, res) => {
  const { name, email, role } = req.body;
  try {
    await pool.query(
      'INSERT INTO workers (name, email, role) VALUES ($1, $2, $3)',
      [name, email, role]
    );
    res.status(201).send('Worker added');
  } catch (err) {
    console.error("Error adding worker:", err);
    res.status(500).send('Server error');
  }
});

// Add new workerforce
app.post('/api/workerforce', async (req, res) => {
  const {
    full_name, dob, gender, mobile, alt_mobile, email,
    emergency_name, emergency_phone, current_address, permanent_address,
    city, state, country, gov_id, skills, availability, work_location, gps, medical
  } = req.body;

  try {
    await pool.query(
      `INSERT INTO workerforce ( 
        full_name, dob, gender, mobile, alt_mobile, email,
        emergency_name, emergency_phone, current_address, permanent_address,
        city, state, country, gov_id, skills, availability, work_location, gps, medical
      ) VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10,
        $11, $12, $13, $14, $15, $16,
        $17, $18, $19
      )`,
      [
        full_name, dob, gender, mobile, alt_mobile, email,
        emergency_name, emergency_phone, current_address, permanent_address,
        city, state, country, gov_id, skills, availability, work_location, gps, medical
      ]
    );

    res.status(201).json({ message: 'Workforce member added' });
  } catch (err) {
    console.error("Error adding workforce member:", err);
    res.status(500).json({ error: err.message });
  }
});

// Accounts API
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function toUuidOrNull(v) {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  return s && UUID_RE.test(s) ? s : null; // empty/invalid -> null
}

function toNumberOrNull(v) {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isNaN(n) ? null : n;
}

app.post("/api/accounts", async (req, res) => {
  try {
    const b = req.body || {};

    const payload = {
      organization_id: toUuidOrNull(b.organization_id),
      name: (b.name || "").trim(),
      status: b.status || null,
      type: b.type || null,
      industry: b.industry || null,
      territory_id: toUuidOrNull(b.territory_id),
      contract_status: b.contract_status || null,
      credit_limit: toNumberOrNull(b.credit_limit),
      payment_terms: b.payment_terms || null,
      total_revenue: toNumberOrNull(b.total_revenue),
      customer_rating: b.customer_rating || null,
      account_manager: toUuidOrNull(b.account_manager),
      created_by: toUuidOrNull(b.created_by),
      updated_by: toUuidOrNull(b.updated_by),
    };

    if (!payload.name) {
      return res.status(400).json({ error: "name is required" });
    }

    const result = await pool.query(
      `INSERT INTO public.accounts
       (organization_id, name, status, type, industry, territory_id, 
        contract_status, credit_limit, payment_terms, total_revenue, 
        customer_rating, account_manager, created_by, updated_by, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,NOW())
       RETURNING *`,
      [
        payload.organization_id,
        payload.name,
        payload.status,
        payload.type,
        payload.industry,
        payload.territory_id,
        payload.contract_status,
        payload.credit_limit,
        payload.payment_terms,
        payload.total_revenue,
        payload.customer_rating,
        payload.account_manager,
        payload.created_by,
        payload.updated_by,
      ]
    );

    return res.status(201).json(result.rows[0]); // <-- single response
  } catch (err) {
    console.error("Insert error:", {
      message: err.message,
      code: err.code,
      detail: err.detail,
    });
    return res
      .status(500)
      .json({ error: err.message, code: err.code, detail: err.detail });
  }
});

app.post("/api/newassets", async (req, res) => {
  try {
    const {
      assetName, description, assetNumber, product, parentAsset, giai,
      orderedDate, installationDate, purchasedDate, warrantyExpiration,
      company, contact, address
    } = req.body || {};

    if (!assetName || !assetName.trim()) {
      return res.status(400).json({ error: "assetName is required" });
    }

    const result = await pool.query(
      `INSERT INTO public.newassets
       (asset_name, description, asset_number, product, parent_asset, giai,
        ordered_date, installation_date, purchased_date, warranty_expiration,
        company, contact, address)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
       RETURNING *`,
      [
        assetName,
        description || null,
        assetNumber || null,
        product || null,
        parentAsset || null,
        giai || null,
        orderedDate || null,
        installationDate || null,
        purchasedDate || null,
        warrantyExpiration || null,
        company || null,
        contact || null,
        address || null,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error inserting asset:", err);
    res.status(500).json({ error: "Failed to insert asset" });
  }
});

// Insert service contract
app.post("/api/service-contract", async (req, res) => {
  try {
    const {
      contractOwner,
      contractNumber,
      contractName,
      description,
      accountName,
      contactName,
      startDate,
      endDate,
      termMonths,
      specialTerms,
      discount,
      shippingHandling,
      tax,
      grandTotal,
      billingStreet,
      billingCity,
      billingZip,
      billingState,
      billingCountry,
      shippingStreet,
      shippingCity,
      shippingZip,
      shippingState,
      shippingCountry,
    } = req.body;

    // Set safe defaults
    const values = [
      contractOwner || null,
      contractNumber || null,
      contractName || null,
      description || null,
      accountName || null,
      contactName || null,
      startDate || null,
      endDate || null,
      termMonths || 0,
      specialTerms || null,
      discount || 0,
      shippingHandling || 0,
      tax || 0,
      grandTotal || 0,
      billingStreet || null,
      billingCity || null,
      billingZip || null,
      billingState || null,
      billingCountry || null,
      shippingStreet || null,
      shippingCity || null,
      shippingZip || null,
      shippingState || null,
      shippingCountry || null,
    ];

    const query = `
      INSERT INTO service_contracts (
        contract_owner, contract_number, contract_name, description,
        account_name, contact_name, start_date, end_date, term_months, special_terms,
        discount, shipping_handling, tax, grand_total,
        billing_street, billing_city, billing_zip, billing_state, billing_country,
        shipping_street, shipping_city, shipping_zip, shipping_state, shipping_country
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
        $11,$12,$13,$14,
        $15,$16,$17,$18,$19,
        $20,$21,$22,$23,$24
      ) RETURNING *;
    `;

    const result = await pool.query(query, values);

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error("Error inserting service contract:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/api/users", async (req, res) => {
  try {
    const {
      organization_id,
      first_name,
      last_name,
      alias,
      email,
      phone,
      company,
      address,
      password_hash,
      role,
      is_active,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO users 
      (organization_id, first_name, last_name, alias, email, phone, company, address, password_hash, role, is_active, created_at) 
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,NOW()) 
      RETURNING *`,
      [
        organization_id,
        first_name,
        last_name,
        alias,
        email,
        phone,
        company,
        address,
        password_hash,
        role,
        is_active,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error inserting user:", err);
    res.status(500).json({ error: "Database error" });
  }
});
// POST new contact
// POST new contact
app.post("/api/contacts", async (req, res) => {
  try {
    const {
      organization_id,
      account_id,
      first_name,
      last_name,
      email,
      phone,
      type,
      street,
      city,
      state,
      postal_code,
      country,
      preferred_contact_method,
      last_service_date,
      special_instructions,
      updated_by,
    } = req.body;

    // Helper to validate UUIDs
    const toUuidOrNull = (v) => {
      if (!v) return null;
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      return uuidRegex.test(v) ? v : null;
    };

    // Validate required fields
    if (!toUuidOrNull(organization_id)) return res.status(400).json({ error: "organization_id required" });
    if (!toUuidOrNull(account_id)) return res.status(400).json({ error: "account_id required" });
    if (!first_name || first_name.trim() === "") return res.status(400).json({ error: "first_name required" });
    if (!toUuidOrNull(updated_by)) return res.status(400).json({ error: "updated_by required" });

    const query = `
      INSERT INTO contacts (
        organization_id, account_id, first_name, last_name, email, phone, type,
        street, city, state, postal_code, country, preferred_contact_method,
        last_service_date, special_instructions, updated_by
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
      RETURNING *
    `;

    const values = [
      toUuidOrNull(organization_id),
      toUuidOrNull(account_id),
      first_name.trim(),
      last_name?.trim() || null,
      email?.trim() || null,
      phone?.trim() || null,
      type?.trim() || null,
      street?.trim() || null,
      city?.trim() || null,
      state?.trim() || null,
      postal_code?.trim() || null,
      country?.trim() || null,
      preferred_contact_method?.trim() || null,
      last_service_date || null,
      special_instructions?.trim() || null,
      toUuidOrNull(updated_by),
    ];

    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error saving contact:", err);
    res.status(500).json({ error: err.message, code: err.code, detail: err.detail });
  }
});

app.post("/api/fields", async (req, res) => {
  const { name, location, area, status, assignedWorker, lastInspection, description } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO fields (name, location, area, status, assigned_worker, last_inspection, description)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [name, location, area, status, assignedWorker, lastInspection, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create field" });
  }
});
app.delete("/api/fields/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM fields WHERE id = $1 RETURNING *", [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Field not found" });
    }
    res.json({ message: "Field deleted", field: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// --- POST add new inventory item ---
app.post('/api/inventory', async (req, res) => {
  const data = req.body;

  // Validate required fields
  if (!data.org_id || !data.item_number || !data.item_name) {
    return res.status(400).json({ error: "org_id, item_number, and item_name are required" });
  }

  const sql = `
    INSERT INTO inventory (
      org_id, item_number, item_name, item_description, category, subcategory,
      unit_of_measure, cost, price, supplier_id, stock_quantity, minimum_stock,
      maximum_stock, reorder_point, warehouse_location, bin_location, serial_tracked,
      lot_tracked, expiry_date, last_purchase_date, last_sale_date, weight,
      dimensions, barcode, image_url, status, created_by, updated_by
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
      $11,$12,$13,$14,$15,$16,$17,$18,$19,$20,
      $21,$22,$23,$24,$25,$26,$27,$28
    )
    RETURNING *;
  `;

  const values = [
    data.org_id,
    data.item_number,
    data.item_name,
    data.item_description || null,
    data.category || null,
    data.subcategory || null,
    data.unit_of_measure || null,
    data.cost || null,
    data.price || null,
    data.supplier_id || null,
    data.stock_quantity || null,
    data.minimum_stock || null,
    data.maximum_stock || null,
    data.reorder_point || null,
    data.warehouse_location || null,
    data.bin_location || null,
    !!data.serial_tracked,
    !!data.lot_tracked,
    data.expiry_date || null,
    data.last_purchase_date || null,
    data.last_sale_date || null,
    data.weight || null,
    data.dimensions || null,
    data.barcode || null,
    data.image_url || null,
    data.status || "active",
    data.created_by || null,
    data.updated_by || null,
  ];

  try {
    const result = await pool.query(sql, values);
    res.status(201).json({ message: "Inventory added successfully!", item: result.rows[0] });
  } catch (err) {
    console.error("Error adding inventory:", err);
    res.status(500).json({ error: err.message, code: err.code, detail: err.detail });
  }
});


// ✅ POST /login route
// app.post('/api/login', async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     // Check if user exists
//     const result = await pool.query("SELECT id, password_hash FROM users WHERE email=$1", [email]);
//     if (result.rows.length === 0) {
//       return res.status(401).json({ message: "Invalid email or password" });
//     }

//     const user = result.rows[0];

//     // Compare password with hashed password in DB
//     const match = await bcrypt.compare(password, user.password_hash);
//     if (!match) {
//       return res.status(401).json({ message: "Invalid email or password" });
//     }

//     // Success → send only user ID
//     res.json({ user: { id: user.id } });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// app.post("/api/login", async (req, res) => {
//   const { email, password } = req.body;
//   console.log("Login attempt:", email);

//   if (!email || !password) {
//     console.log("Missing email or password");
//     return res.status(400).json({ message: "Email and password are required" });
//   }

//   try {
//     const result = await pool.query("SELECT id, password_hash FROM users WHERE email=$1", [email]);

//     if (result.rows.length === 0) {
//       console.log("User not found for email:", email);
//       return res.status(401).json({ message: "Invalid email or password" });
//     }

//     const user = result.rows[0];
//     const match = await bcrypt.compare(password, user.password_hash);
//     console.log("Password match:", match);

//     if (!match) {
//       return res.status(401).json({ message: "Invalid email or password" });
//     }

//     res.json({ user: { id: user.id } });
//   } catch (err) {
//     console.error("Login error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });


app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password required" });

  try {
    // Fetch user by email dynamically from DB
    const result = await pool.query(
      "SELECT id, password_hash FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0)
      return res.status(401).json({ message: "Invalid email or password" });

    const user = result.rows[0];

    // Compare client password with DB hashed password
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password" });

    // Login successful, return user info (range sensitive data as needed)
    res.json({ userId: user.id, email });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});



// // Get all invoices
app.get('/api/invoices', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM invoices ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Get all quotes
app.get("/api/quotes/dropdown", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, quote_number AS name FROM quotes ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching quotes:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get all work orders
app.get("/api/work_orders/dropdown", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, work_order_number AS name FROM work_orders ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching work orders:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get invoice by ID
app.get('/api/invoices/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM invoices WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Invoice not found' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// // Create new invoice
app.post('/api/invoices', async (req, res) => {
  const {
    organization_id, customer_id, invoice_number, work_order_id,
    status, subtotal, tax_amount, discount, total_amount, currency, due_date, notes
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO invoices 
      (id, organization_id, customer_id, invoice_number, work_order_id, status, subtotal, tax_amount, discount, total_amount, currency, due_date, notes)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
      [uuidv4(), organization_id, customer_id, invoice_number, work_order_id, status, subtotal, tax_amount, discount, total_amount, currency, due_date, notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update invoice
app.put('/api/invoices/:id', async (req, res) => {
  const { id } = req.params;
  const {
    status, subtotal, tax_amount, discount, total_amount, due_date, notes
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE invoices SET 
      status=$1, subtotal=$2, tax_amount=$3, discount=$4, total_amount=$5, due_date=$6, notes=$7, updated_at=NOW()
      WHERE id=$8 RETURNING *`,
      [status, subtotal, tax_amount, discount, total_amount, due_date, notes, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Invoice not found' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete invoice
app.delete('/api/invoices/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM invoices WHERE id=$1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Invoice not found' });
    res.json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get all quotes
app.get("/api/quotes", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM quotes ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching quotes:", err);
    res.status(500).json({ error: err.message });
  }
});


// 🟢 Create new quote
app.post("/api/quotes", async (req, res) => {
  try {
    const {
      organization_id,
      customer_id,
      work_order_id,
      quote_number,
      status,
      subtotal,
      tax_amount,
      discount,
      total_amount,
      currency,
      valid_until,
      notes,
      created_by,
      updated_by,
    } = req.body;

    // ✅ Validate required fields
    if (!organization_id) {
      return res.status(400).json({ error: "Organization ID is required" });
    }
    if (!customer_id) {
      return res.status(400).json({ error: "Customer ID is required" });
    }

    // ✅ Convert "" → null for optional fields
    const orgId = organization_id;
    const custId = customer_id;
    const woId = work_order_id || null;
    const noteText = notes || null;
    const createdBy = created_by || null;
    const updatedBy = updated_by || null;
    const validUntil = valid_until || null;

    // ✅ Insert into DB
    const result = await pool.query(
      `INSERT INTO quotes 
      (id, organization_id, customer_id, work_order_id, quote_number, status,
       subtotal, tax_amount, discount, total_amount, currency, valid_until,
       notes, created_by, updated_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
       RETURNING *`,
      [
        uuidv4(),
        orgId,
        custId,
        woId,
        quote_number,
        status,
        subtotal || 0,
        tax_amount || 0,
        discount || 0,
        total_amount || 0,
        currency,
        validUntil,
        noteText,
        createdBy,
        updatedBy,
      ]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error inserting quote:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 🟢 Update quote
app.put("/api/quotes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      status,
      subtotal,
      tax_amount,
      discount,
      total_amount,
      valid_until,
      notes,
    } = req.body;

    const result = await pool.query(
      `UPDATE quotes SET 
      status=$1, subtotal=$2, tax_amount=$3, discount=$4,
      total_amount=$5, valid_until=$6, notes=$7, updated_at=NOW()
      WHERE id=$8 RETURNING *`,
      [
        status || null,
        subtotal || 0,
        tax_amount || 0,
        discount || 0,
        total_amount || 0,
        valid_until || null,
        notes || null,
        id,
      ]
    );

    // no 404, just return {}
    if (result.rows.length === 0) return res.json({});
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating quote:", error);
    res.status(500).json({ error: error.message });
  }
});

// 🟢 Delete quote
app.delete("/api/quotes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM quotes WHERE id=$1 RETURNING *", [id]);
    // no 404, just return {deleted:false}
    if (result.rows.length === 0)
      return res.json({ deleted: false, message: "Quote not found" });

    res.json({ deleted: true, message: "Quote deleted successfully" });
  } catch (error) {
    console.error("Error deleting quote:", error);
    res.status(500).json({ error: error.message });
  }
});


 // 1️⃣ GET /api/invoices
app.get("/api/invoices", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, invoice_number AS name FROM invoices ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching invoices:", err);
    res.status(500).json({ error: "Failed to fetch invoices" });
  }
});

// 2️⃣ POST /api/invoice_items
// app.post('/api/invoice_items', async (req, res) => {
//   try {
//     const { invoice_id, description, quantity, unit_price } = req.body;

//     // Validate required fields
//     if (!invoice_id || !description || !unit_price) {
//       return res.status(400).json({ error: 'Missing required fields' });
//     }

//     const qty = quantity || 1;
//    const total = qty * unit_price;

// const result = await db.query(
//   `INSERT INTO invoice_items (id, invoice_id, description, quantity, unit_price, total)
//    VALUES (gen_random_uuid(), $1, $2, $3, $4, $5)
//    RETURNING *`,
//   [invoice_id, description, qty, unit_price, total]
// );

//     res.json(result.rows[0]);
//   } catch (err) {
//     console.error('Error creating invoice item:', err);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

app.post('/api/invoice_items', async (req, res) => {
  try {
    const { invoice_id, description, quantity, unit_price } = req.body;

    if (!invoice_id || !description || unit_price === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const qty = Number(quantity) || 1;
    const price = Number(unit_price);
    const total = qty * price;

   const result = await pool.query(
  `INSERT INTO invoice_items (id, invoice_id, description, quantity, unit_price, total)
   VALUES (gen_random_uuid(), $1, $2, $3, $4, $5)
   RETURNING *`,
  [invoice_id, description, qty, price, total]
);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error creating invoice item:', err);
    res.status(500).json({ error: err.message });
  }
});


app.get("/api/invoice_items", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT ii.id, ii.invoice_id, i.invoice_number, ii.description, ii.quantity, ii.unit_price, ii.total
  FROM invoice_items ii
  JOIN invoices i ON ii.invoice_id = i.id
  ORDER BY ii.id DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching invoice items:", err);
    res.status(500).json({ error: "Failed to fetch invoice items" });
  }
});


// // CUSTOMER_FEEDBACK

app.get("/api/customer_feedback", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM customer_feedback ORDER BY submitted_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching customer feedback:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/customer_feedback", async (req, res) => {
  try {
    const { organization_id, rating } = req.body;
    if (!organization_id || !rating) {
      return res.status(400).json({ error: "organization_id and rating are required" });
    }
    const submitted_at = new Date();
    await pool.query(
      `INSERT INTO customer_feedback
       (id, organization_id, rating, submitted_at)
       VALUES (gen_random_uuid(), $1, $2, $3)`,
      [organization_id, rating, submitted_at]
    );
    res.status(201).json({ message: "Feedback saved" });
  } catch (err) {
    console.error("Error inserting customer feedback:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



// PAYMENT
// Get all payments 
// GET all payments
app.get("/api/payments", async (req, res) => {
  try {
    const result = await pool.query(   // changed db to pool
      `SELECT p.*, i.invoice_number, a.name as customer_name
       FROM payments p
       LEFT JOIN invoices i ON p.invoice_id = i.id
       LEFT JOIN accounts a ON p.customer_id = a.id
       ORDER BY p.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching payments:", err);
    res.status(500).json({ error: err.message });
  }
});


// POST create new payment
app.post("/api/payments", async (req, res) => {
  try {
    const {
      invoice_id,
      customer_id,
      payment_date,
      amount,
      method,
      reference_number,
      status,
      notes,
    } = req.body;

    // Validate
    if (!invoice_id || !customer_id || !payment_date || !amount || !method || !status) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Insert
    const result = await pool.query(
      `INSERT INTO payments
       (id, invoice_id, customer_id, payment_date, amount, method, reference_number, status, notes, created_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, NOW())
       RETURNING *`,
      [
        invoice_id,
        customer_id,
        payment_date,
        amount,
        method,
        reference_number || null,
        status,
        notes || null,
      ]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error creating payment:", err); // << show full DB error
    res.status(500).json({ error: err.message }); // << return real message
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

