const fast2sms=require('fast-two-sms');
const axios = require('axios');

exports.sendsms = async (msg, numbers) => {
  try {
     const numbersStr = Array.isArray(numbers) ? numbers.join(",") : numbers;
    const response = await axios.post(
      'https://www.fast2sms.com/dev/bulkV2',
      {
        message: msg,
        language: 'english',
        route: 'q', // 'otp' or 'transactional' based on your account setup
        numbers:numbersStr // pass number as string: "9876543210"
      },
      {
        headers: {
          authorization: process.env.SMS_API_KEY, // Make sure this is set in .env
          'Content-Type': 'application/json'
        }
      }
    );

    console.log("SMS API Raw Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("SMS sending failed:", error.response?.data || error.message);
    throw error;
  }
};

