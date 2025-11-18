// Netlify Function to proxy API calls and bypass CORS issues
exports.handler = async (event, context) => {
  try {
    const coordinatorHost = process.env.COORDINATOR_HOST || 'localhost';
    const coordinatorPort = process.env.COORDINATOR_PORT || '9000';
    const protocol = coordinatorPort === '443' ? 'https' : 'http';
    const portString = (coordinatorPort === '443' && protocol === 'https') || (coordinatorPort === '80' && protocol === 'http') ? '' : `:${coordinatorPort}`;
    const apiUrl = `${protocol}://${coordinatorHost}${portString}/api/status`;

    console.log(`Proxying request to: ${apiUrl}`);

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({
          error: `API returned ${response.status}: ${response.statusText}`
        }),
      };
    }

    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('Proxy error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: `Failed to fetch from coordinator: ${error.message}`
      }),
    };
  }
};
