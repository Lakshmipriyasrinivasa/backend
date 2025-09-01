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

const workOrdersRouter = require("./routes/workorder");

app.use("/api/work_orders", workOrdersRouter);

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
app.get("/api/users", async (req, res) => {
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

app.listen(5000, () => console.log("Server running on port 5000"));
