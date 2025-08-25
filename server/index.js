import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;


app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});




app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    database: 'SQLite'
  });
});


app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});


app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});


const startServer = async () => {
  try {
    console.log('Starting server...');
    

    console.log('Loading modules...');
    const { checkConnection } = await import('./config/db.js');
    const { createAllTables } = await import('./utils/dbSchema.js');
    const { insertSampleData } = await import('./utils/sampleData.js');
    const authRoutes = (await import('./routes/authRoutes.js')).default;
    const courseRoutes = (await import('./routes/courseRoutes.js')).default;
    console.log('Modules loaded successfully');
    

    app.use('/api/auth', authRoutes);
    app.use('/api/courses', courseRoutes);
    console.log('Routes configured');
    

    console.log('Initializing SQLite database...');
    await checkConnection();
    console.log('Database connection established');
    
    console.log('Creating database tables...');
    await createAllTables();
    console.log('Database tables created');
    
    console.log('Inserting sample data...');
    await insertSampleData();
    console.log('Sample data inserted');
    
    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Database initialization failed:', error.message);
    console.error('Error stack:', error.stack);
    console.log('Server will continue with limited functionality');
  }
  
  console.log('Starting Express server...');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
    console.log(`Using SQLite database`);
    console.log('Server ready to accept requests!');
  });
};

startServer().catch(console.error);