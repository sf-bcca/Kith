// const fetch = require('node-fetch');

async function testSiblings() {
  const memberId = '5635cc31-14f3-41a9-a5d5-36289c76516e';
  // Use the test token if possible, or login to get one. 
  // For now, let's try to assume we can hit it if we had a token, 
  // but since I don't have a valid token easily accessible in this script without login...
  // I will skip auth if possible or just check if it 500s vs 401s.
  // Actually, I can use the same approach as manual_verify_service if I had the token.
  
  // Let's just try to hit the health endpoint first to confirm connectivity
  try {
    const health = await fetch('http://localhost:8081/api/health');
    console.log('Health:', await health.json());
  } catch (e) {
    console.error('Health check failed:', e);
  }
}

testSiblings();
