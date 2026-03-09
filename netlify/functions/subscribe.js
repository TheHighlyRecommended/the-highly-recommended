exports.handler = async function(event) {
  console.log('Function called, method:', event.httpMethod);

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let email;
  try {
    const body = JSON.parse(event.body);
    email = body.email;
    console.log('Email received:', email);
  } catch(e) {
    console.log('Body parse error:', e.message, 'Raw body:', event.body);
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  if (!email) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Email required' }) };
  }

  console.log('Calling Kit API, key present:', !!process.env.KIT_API_KEY);

  try {
    const response = await fetch('https://api.kit.com/v4/forms/9181918/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Kit-Api-Key': process.env.KIT_API_KEY
      },
      body: JSON.stringify({ email_address: email })
    });

    const data = await response.json();
    console.log('Kit status:', response.status, 'data:', JSON.stringify(data));

    if (!response.ok) {
      return { statusCode: 500, body: JSON.stringify({ error: data }) };
    }

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ success: true })
    };
  } catch(e) {
    console.log('Fetch error:', e.message);
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
