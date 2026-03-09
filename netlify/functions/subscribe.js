exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { email } = JSON.parse(event.body);
  if (!email) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Email required' }) };
  }

  console.log('Attempting to subscribe:', email);

  const response = await fetch('https://api.kit.com/v4/forms/9181918/subscribers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Kit-Api-Key': process.env.KIT_API_KEY
    },
    body: JSON.stringify({ email_address: email })
  });

  const data = await response.json();
  console.log('Kit response status:', response.status);
  console.log('Kit response body:', JSON.stringify(data));

  if (!response.ok) {
    return { statusCode: 500, body: JSON.stringify({ error: data }) };
  }

  return {
    statusCode: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({ success: true })
  };
};
