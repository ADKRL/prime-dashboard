// Netlify Function to proxy API calls and bypass CORS issues
exports.handler = async (event, context) => {
  const startTime = Date.now();
  console.log('[API-PROXY] Incoming request:', {
    method: event.httpMethod,
    path: event.path,
    timestamp: new Date().toISOString(),
    requestId: context.awsRequestId,
  });

  try {
    const coordinatorHost = process.env.COORDINATOR_HOST || 'localhost';
    const coordinatorPort = process.env.COORDINATOR_PORT || '9000';
    const protocol = coordinatorPort === '443' ? 'https' : 'http';
    const portString = (coordinatorPort === '443' && protocol === 'https') || (coordinatorPort === '80' && protocol === 'http') ? '' : `:${coordinatorPort}`;
    const apiUrl = `${protocol}://${coordinatorHost}${portString}/api/status`;

    console.log('[API-PROXY] Configuration:', {
      host: coordinatorHost,
      port: coordinatorPort,
      protocol: protocol,
      fullUrl: apiUrl,
    });

    console.log(`[API-PROXY] Proxying request to: ${apiUrl}`);

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
        'User-Agent': 'prime-dashboard-proxy',
      },
    });

    console.log('[API-PROXY] Response received:', {
      status: response.status,
      statusText: response.statusText,
      contentType: response.headers.get('content-type'),
    });

    if (!response.ok) {
      console.error('[API-PROXY] API error response:', {
        status: response.status,
        statusText: response.statusText,
      });
      return {
        statusCode: response.status,
        body: JSON.stringify({
          error: `API returned ${response.status}: ${response.statusText}`
        }),
      };
    }

    const data = await response.json();
    const duration = Date.now() - startTime;

    console.log('[API-PROXY] Request successful:', {
      status: 200,
      duration: `${duration}ms`,
      dataSize: JSON.stringify(data).length,
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error('[API-PROXY] Proxy error:', {
      error: error.message,
      stack: error.stack,
      duration: `${duration}ms`,
    });
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: `Failed to fetch from coordinator: ${error.message}`
      }),
    };
  }
};
