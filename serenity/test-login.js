// Test login with provided credentials
const axios = require('axios');

async function testLogin() {
  try {
    console.log('Testing login with amit@zerobyte.com...');
    
    const response = await axios.post('http://localhost:8080/api/auth/login', {
      username: 'amit@zerobyte.com',
      password: 'Password7'
    });
    
    console.log('Login successful!');
    console.log('Response:', response.data);
    
    // Test getting profile with this token
    const token = response.data.accessToken;
    console.log('\nTesting profile retrieval...');
    
    try {
      const profileResponse = await axios.get('http://localhost:8080/api/auth/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Profile response:', profileResponse.data);
    } catch (profileError) {
      console.log('Profile error:', profileError.response?.data);
      
      // Try extracting userId from token and using /user/{id} endpoint
      const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
      console.log('Token payload:', payload);
      
      if (payload.userId) {
        try {
          const userResponse = await axios.get(`http://localhost:8080/api/user/${payload.userId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          console.log('User endpoint response:', userResponse.data);
        } catch (userError) {
          console.log('User endpoint error:', userError.response?.data);
        }
      }
    }
    
  } catch (error) {
    console.error('Login failed:');
    console.error('Status:', error.response?.status);
    console.error('Error:', error.response?.data || error.message);
  }
}

testLogin();
