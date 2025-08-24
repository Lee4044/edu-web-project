console.log('🔄 Testing imports...');

try {
  console.log('1. Testing express import...');
  const express = await import('express');
  console.log('✅ Express imported');
  
  console.log('2. Testing cors import...');
  const cors = await import('cors');
  console.log('✅ CORS imported');
  
  console.log('3. Testing dotenv import...');
  const dotenv = await import('dotenv');
  console.log('✅ Dotenv imported');
  
  console.log('4. Testing db config import...');
  const dbConfig = await import('./config/db.js');
  console.log('✅ DB config imported');
  
  console.log('5. Testing schema import...');
  const schema = await import('./utils/dbSchema.js');
  console.log('✅ Schema imported');
  
  console.log('6. Testing sample data import...');
  const sampleData = await import('./utils/sampleData.js');
  console.log('✅ Sample data imported');
  
  console.log('7. Testing auth routes import...');
  const authRoutes = await import('./routes/authRoutes.js');
  console.log('✅ Auth routes imported');
  
  console.log('8. Testing course routes import...');
  const courseRoutes = await import('./routes/courseRoutes.js');
  console.log('✅ Course routes imported');
  
  console.log('\n🎉 All imports successful!');
} catch (error) {
  console.error('❌ Import failed:', error);
}