async function startServer() {
  console.log('🔄 Starting server...');

  // Dynamic imports to avoid hanging
  const express = (await import('express')).default;
  const cors = (await import('cors')).default;
  const dotenv = (await import('dotenv')).default;
  console.log('📦 Basic imports loaded');

  const { checkConnection } = await import('./config/db.js');
  console.log('🗄️  Database config loaded');

  const { createAllTables } = await import('./utils/dbSchema.js');
  console.log('📋 Schema loaded');

  const insertSampleData = (await import('./utils/sampleData.js')).default;
  console.log('📊 Sample data loaded');

  const authRoutes = (await import('./routes/authRoutes.js')).default;
  const courseRoutes = (await import('./routes/courseRoutes.js')).default;
  console.log('🛣️  Routes loaded');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'], // Allow both React and Vite dev servers
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Educational Web API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Educational Web API',
    endpoints: {
      auth: '/api/auth',
      courses: '/api/courses',
      health: '/api/health'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: req.originalUrl
  });
});

// Start server 
app.listen(PORT, async () => {
  console.log(`\n🚀 Server is running on port ${PORT}`);
  console.log(`📱 API Base URL: http://localhost:${PORT}/api`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
  
  console.log('\n🎉 Server ready to accept requests!');
  
  // Initialize database in background
  setTimeout(async () => {
    console.log('\n🔄 Initializing database...');
    try {
      const dbConnected = await checkConnection();
      
      if (dbConnected) {
        await createAllTables();
        await insertSampleData();
        console.log('✅ Database initialization complete!');
      } else {
        console.log('⚠️  Database not available - using fallback data');
      }
    } catch (error) {
      console.error('❌ Database setup failed:', error.message);
      console.log('⚠️  Using fallback data');
    }
  }, 1000);
});

}

// Start the server
startServer().catch(console.error);