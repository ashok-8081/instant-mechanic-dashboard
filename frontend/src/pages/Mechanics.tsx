import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

const Mechanics: React.FC = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Mechanics</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-center py-12 text-gray-500">
                    Mechanics list will appear here
                </div>
            </CardContent>
        </Card>
    );
};

export default Mechanics;