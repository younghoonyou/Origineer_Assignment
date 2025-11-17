const fs = require('fs');
const path = require('path');
const axios = require('axios');

async function testRefund() {
  try {
    const dataPath = path.join(process.cwd(), 'test-data', 'refund.json');
    const payload = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    const res = await axios.post(
      'http://localhost:3000/api/trnx/refund',
      payload
    );

    console.log('Response:', res.data);
  } catch (error) {
    console.error('Test refund error:', error.response?.data || error.message);
  }
}

testRefund();
