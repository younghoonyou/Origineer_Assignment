const fs = require('fs');
const path = require('path');
const axios = require('axios');

async function testSale() {
  try {
    const dataPath = path.join(process.cwd(), 'test-data', 'sale.json');
    const fileContent = fs.readFileSync(dataPath, 'utf8');
    const payload = JSON.parse(fileContent);

    const res = await axios.post(
      'http://localhost:3000/api/trnx/sale',
      payload
    );
    console.log('Response:', res.data);
  } catch (error) {
    console.error('Test sale error:', error.response?.data || error.message);
  }
}

testSale();
