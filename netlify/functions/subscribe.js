exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const params = new URLSearchParams(event.body);
    const email = params.get('email');
    const firstName = params.get('first_name');

    console.log('Received signup:', email, firstName);

    if (!email) {
      console.log('No email provided');
      return { statusCode: 400, body: JSON.stringify({ error: 'Email is required' }) };
    }

    const apiKey = process.env.MAILERLITE_API_KEY;
    if (!apiKey) {
      console.log('ERROR: MAILERLITE_API_KEY env variable not set');
      return { statusCode: 500, body: JSON.stringify({ error: 'API key not configured' }) };
    }

    console.log('Sending to MailerLite...');

    const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        fields: {
          name: firstName || '',
        },
        groups: ['181352064527370192'],
      }),
    });

    const responseText = await response.text();
    console.log('MailerLite response status:', response.status);
    console.log('MailerLite response body:', responseText);

    if (!response.ok) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Failed to subscribe' }) };
    }

    return { statusCode: 200, body: JSON.stringify({ success: true }) };

  } catch (err) {
    console.log('Function error:', err.message);
    return { statusCode: 500, body: JSON.stringify({ error: 'Server error' }) };
  }
};
