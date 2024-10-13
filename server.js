import express from 'express';
import pg from 'pg';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const pool = new pg.Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

app.use(cors());
app.use(express.json());

// Interventions API
app.get('/api/interventions', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM interventions');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/interventions', async (req, res) => {
  const { date, intervention, nombreBons, cdh, gdh, totalHT, sansVouchers, natureIntervention, personneEnCharge, dateEmail, createdBy } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO interventions (date, intervention, nombre_bons, cdh, gdh, total_ht, sans_vouchers, nature_intervention, personne_en_charge, date_email, created_by, last_modified_by, last_modified_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $11, NOW()) RETURNING *',
      [date, intervention, nombreBons, cdh, gdh, totalHT, sansVouchers, natureIntervention, personneEnCharge, dateEmail, createdBy]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/interventions/:id', async (req, res) => {
  const { id } = req.params;
  const { date, intervention, nombreBons, cdh, gdh, totalHT, sansVouchers, natureIntervention, personneEnCharge, dateEmail, lastModifiedBy } = req.body;
  try {
    const result = await pool.query(
      'UPDATE interventions SET date = $1, intervention = $2, nombre_bons = $3, cdh = $4, gdh = $5, total_ht = $6, sans_vouchers = $7, nature_intervention = $8, personne_en_charge = $9, date_email = $10, last_modified_by = $11, last_modified_at = NOW() WHERE id = $12 RETURNING *',
      [date, intervention, nombreBons, cdh, gdh, totalHT, sansVouchers, natureIntervention, personneEnCharge, dateEmail, lastModifiedBy, id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Intervention not found' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/interventions/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM interventions WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Intervention not found' });
    } else {
      res.json({ message: 'Intervention deleted successfully' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Users API
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, username, role FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/users', async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role',
      [username, password, role]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.json({ message: 'User deleted successfully' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query('SELECT id, username, role FROM users WHERE username = $1 AND password = $2', [username, password]);
    if (result.rows.length === 0) {
      res.status(401).json({ error: 'Invalid credentials' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});