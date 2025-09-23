import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FaultReportForm } from "@/components/FaultReportForm";
import { API_BASE_URL } from '@/lib/api';
import { testApiConnection } from '@/lib/test-api';

export default function FaultReports() {
  const [showForm, setShowForm] = useState(false);
  const [selectedFault, setSelectedFault] = useState<any>(null);
  const [faults, setFaults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const LOCAL_FAULTS_KEY = 'localFaultReports';

  const readLocal = () => {
    try {
      const raw = localStorage.getItem(LOCAL_FAULTS_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  };

  const mergedFaults = useMemo(() => {
    return faults.sort((a, b) => {
      const aTime = new Date(a.createdAt || a.date || 0).getTime();
      const bTime = new Date(b.createdAt || b.date || 0).getTime();
      return bTime - aTime;
    });
  }, [faults]);

  const fetchFaults = async () => {
    setLoading(true);
    setError(null);
    
    const connectionTest = await testApiConnection();
    console.log('API Connection Test:', connectionTest);
    
    if (!connectionTest.success) {
      const localFaults = readLocal();
      setFaults(localFaults);
      setError(`Backend unreachable (${connectionTest.url}): ${connectionTest.message}`);
      setLoading(false);
      return;
    }
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/faults`);
      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.message || 'Failed to fetch fault reports');
      }
      const backendFaults = data.data?.faults || [];
      const localFaults = readLocal();
      setFaults([...localFaults, ...backendFaults]);
    } catch (e) {
      const localFaults = readLocal();
      setFaults(localFaults);
      setError(`API Error: ${e instanceof Error ? e.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaults();
  }, [showForm]);

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">New Fault Report</h2>
            <p className="text-muted-foreground">
              Submit a detailed fault report for asset management
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setShowForm(false)}
          >
            Back to Reports
          </Button>
        </div>
        <FaultReportForm />
      </div>
    );
  }

  if (selectedFault) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Fault Report Details</h2>
            <p className="text-muted-foreground">
              {selectedFault.id} - {selectedFault.title}
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setSelectedFault(null)}
          >
            Back to Reports
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>{selectedFault.title}</CardTitle>
            <CardDescription>Reported by {selectedFault.reporter}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-medium">Asset ID</p>
                <p className="text-muted-foreground">{selectedFault.assetId}</p>
              </div>
              <div>
                <p className="font-medium">Severity</p>
                <p className="text-muted-foreground capitalize">{selectedFault.severity}</p>
              </div>
              <div>
                <p className="font-medium">Date Reported</p>
                <p className="text-muted-foreground">{new Date(selectedFault.createdAt || selectedFault.date).toLocaleString()}</p>
              </div>
              <div>
                <p className="font-medium">Location</p>
                <p className="text-muted-foreground">{selectedFault.location || 'Not specified'}</p>
              </div>
            </div>
            <div>
              <p className="font-medium">Description</p>
              <p className="text-muted-foreground">{selectedFault.description}</p>
            </div>
            {selectedFault.observedCause && (
              <div>
                <p className="font-medium">Observed Cause</p>
                <p className="text-muted-foreground">{selectedFault.observedCause}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Fault Reports</h2>
          <p className="text-muted-foreground">
            Manage and track asset fault reports
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Fault Report
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>
            All fault reports submitted in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading reports...</p>
            </div>
          ) : mergedFaults.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                No fault reports to display. Click the button above to create your first report.
              </p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Fault Report
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {error && (
                <p className="text-sm text-yellow-600">{error}</p>
              )}
              <ul className="divide-y">
                {mergedFaults.map((f) => (
                  <li key={f.id} className="py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 cursor-pointer" onClick={() => setSelectedFault(f)}>
                        <p className="font-medium hover:text-blue-600">
                          {f.title} {String(f.id).startsWith('local_') && <span className="ml-2 text-xs text-muted-foreground">(Local)</span>}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {f.assetId} • {f.severity} • {new Date(f.createdAt || f.date).toLocaleString()}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setSelectedFault(f)}>
                        View
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}