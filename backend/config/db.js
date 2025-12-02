const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DB_URL,
    ssl: process.env.DB_URL.includes('localhost') ? false : { 
        rejectUnauthorized: false 
    },
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 30000,
    query_timeout: 10000,
    max: 10,
    min: 2,
    allowExitOnIdle: false
});

// Reconnect logic
pool.on('error', (err, client) => {
    console.error('Kutilmagan database xatosi:', err.message);
});

// Test connection with retry
const testConnection = async (retries = 3) => {
    for (let i = 0; i < retries; i++) {
        try {
            const client = await pool.connect();
            console.log('✅ Database ulanishi muvaffaqiyatli');
            await client.query('SELECT NOW()');
            client.release();
            return;
        } catch (err) {
            console.error(`❌ Ulanish urinishi ${i + 1}/${retries} muvaffaqiyatsiz:`, err.message);
            if (i === retries - 1) {
                console.error('Database ulanmadi. Internet va database URL ni tekshiring.');
            } else {
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }
    }
};

testConnection();

module.exports = pool;