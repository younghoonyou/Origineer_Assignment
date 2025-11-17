const axios = require('axios');

async function testSummary() {
  try {
    const date = 'YYYY-MM-DD'; // replace today
    const res = await axios.get(
      `http://localhost:3000/api/trnx/summary/${date}`
    );

    console.log('Daily Summary:', res.data);
  } catch (error) {
    console.error('Summary Test Error:', error.response?.data || error.message);
  }
}

testSummary();
