'use client';

import { useCloudFunctions } from '@/hooks/use-cloud-functions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function CloudFunctionTest() {
  const { getTasks, loading, error, isAuthenticated } = useCloudFunctions();

  const handleGetTasks = async () => {
    const result = await getTasks();
    if (result) {
      console.log('Tasks from Cloud Function:', result);
    }
  };

  if (!isAuthenticated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cloud Function Test</CardTitle>
          <CardDescription>Test calling getTasks Cloud Function</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>
              Please sign in to test the Cloud Function
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cloud Function Test</CardTitle>
        <CardDescription>Test calling getTasks Cloud Function with authentication</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={handleGetTasks} 
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Calling getTasks...' : 'Call getTasks Cloud Function'}
        </Button>
        
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="text-sm text-muted-foreground">
          <p>✅ User authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
          <p>📍 Region: europe-central2</p>
          <p>🔗 URL: http://localhost:5001/studio-4444518969-8ccb5/europe-central2/getTasks</p>
        </div>
      </CardContent>
    </Card>
  );
}
