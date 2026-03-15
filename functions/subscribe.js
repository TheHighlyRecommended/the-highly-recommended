exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const params = new URLSearchParams(event.body);
    const email = params.get('email');
    const firstName = params.get('first_name');

    if (!email) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Email is required' }) };
    }

    const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MAILERLITE_API_KEY}`,
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

    if (!response.ok) {
      const error = await response.text();
      console.error('MailerLite error:', error);
      return { statusCode: 500, body: JSON.stringify({ error: 'Failed to subscribe' }) };
    }

    return { statusCode: 200, body: JSON.stringify({ success: true }) };

  } catch (err) {
    console.error('Function error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Server error' }) };
  }
};
