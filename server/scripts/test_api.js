
const fetch = require('node-fetch'); // NOTE: Assuming node-fetch is available. If not, will use native fetch if node 18+

const API_URL = 'http://localhost:8081';

async function testLinkApi() {
  console.log('Testing Link API...');
  
  // We need a token. Let's try to login or just use a known one? 
  // For this script, maybe we can assume we need to login first?
  // Or maybe we can bypass auth if we don't have credentials?
  // Let's rely on the user having a valid token if possible, or skip auth middleware?
  // No, we can't easily skip auth middleware without changing code.
  // Let's try to login as a known user if possible.
  
  // Actually, let's just create a dummy "token" if the secret is "dev-secret".
  // Or even better, let's just make the request and see if we get 401. If 401, then at least the server is reachable.
  // If we get 404, then the route is missing.
  // If we get 400, then the body is wrong.
  
  // Let's assume we have a token from a previous login or just try without and expect 401.
  // But we want to test 200.
  
  // Let's try manual login in the script using the database reset script user if known?
  // The .env has DB credentials but not app user credentials.
  
  // Alternative: Read `server.log` again. Maybe I missed something.
  // The previous tail -n 50 was empty.
  
  // Let's try to hit the endpoint with a fake token.
  try {
      const res = await fetch(`${API_URL}/api/members/link`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer test-token' 
          },
          body: JSON.stringify({
              memberId: 'test-id-1',
              relativeId: 'test-id-2',
              relationshipType: 'child'
          })
      });
      console.log(`Response Status: ${res.status}`);
      const text = await res.text();
      console.log(`Response Body: ${text}`);
  } catch (e) {
      console.error('Fetch Error:', e);
  }
}

testLinkApi();
