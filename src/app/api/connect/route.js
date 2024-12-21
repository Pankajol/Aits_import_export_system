import sql from 'mssql';

const sqlConfig = {
  user: process.env.DB_USER, // Accessing environment variable for username
  password: process.env.DB_PASSWORD, // Accessing environment variable for password
  server: process.env.DB_SERVER, // Accessing environment variable for server
  database: process.env.DB_DATABASE, // Accessing environment variable for database
  options: {
    encrypt: true, // Use encryption if needed
    trustServerCertificate: true, // Use this if your server's certificate is not trusted
    port: parseInt(process.env.DB_PORT, 10), // Ensure port is a number
  },
};

export default async function handler(req, res) {
  try {
    // Attempt to connect to the SQL Server
    await sql.connect(sqlConfig);

    // If successful, send the success message
    res.status(200).json({ message: 'Connected to SQL Server successfully!!!!' });
  } catch (error) {
    // If there's an error, catch it and send a failure message
    console.error('Database connection failed:', error);
    res.status(500).json({ message: 'Database connection failed: ' + error.message });
  }
}
