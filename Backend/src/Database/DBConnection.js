import mysql from 'mysql2/promise';

const ConnectDatabase = async () => {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'friendzone',
    });
    // console.log('Connected to the MySQL database successfully!');
    return connection;
  } catch (error) {
    console.error('Error connecting to the database:', error.message);
    throw error; 
  }
};

export default ConnectDatabase;