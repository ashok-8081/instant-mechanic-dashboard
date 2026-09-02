// No import needed - Vercel provides this automatically
export default async function handler(req: any, res: any) {
    // Get the path from the request
    const path = req.query.path as string[];
    const pathString = path ? path.join('/') : '';
    
    // Your EC2 backend URL
    const backendUrl = `http://13.60.40.245:5000/api/${pathString}`;
    
    try {
        // Forward the request to your backend
        const response = await fetch(backendUrl, {
            method: req.method || 'GET',
            headers: {
                'Content-Type': req.headers['content-type'] || 'application/json',
                'Authorization': req.headers.authorization || '',
            },
            body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
        });
        
        // Get the response
        const data = await response.json();
        
        // Send it back to the frontend
        res.status(response.status).json(data);
    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({
            success: false,
            message: 'Backend connection failed'
        });
    }
}