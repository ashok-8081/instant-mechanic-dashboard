// frontend/api/[...path].ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Get the path from the request
    const path = req.query.path as string[];
    const pathString = path.join('/');
    
    // Your EC2 backend URL
    const backendUrl = `http://13.60.40.245:5000/api/${pathString}`;
    
    // Forward the request to your backend
    const response = await fetch(backendUrl, {
        method: req.method,
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
}