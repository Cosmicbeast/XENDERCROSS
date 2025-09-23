import { API_BASE_URL } from '@/lib/api';
import { testApiConnection } from '@/lib/test-api';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function ApiDebug() {
  const [testResult, setTestResult] = useState<any>(null);
  
  const runTest = async () => {
    const result = await testApiConnection();
    setTestResult(result);
  };

  return (
    <div className="p-4 border rounded bg-muted/50 text-sm">
      <p><strong>Current URL:</strong> {window.location.href}</p>
      <p><strong>Hostname:</strong> {window.location.hostname}</p>
      <p><strong>Detected API URL:</strong> {API_BASE_URL}</p>
      <Button size="sm" onClick={runTest} className="mt-2">Test Connection</Button>
      {testResult && (
        <div className="mt-2">
          <p><strong>Test Result:</strong> {testResult.success ? '✅ Success' : '❌ Failed'}</p>
          <p><strong>Message:</strong> {testResult.message}</p>
        </div>
      )}
    </div>
  );
}