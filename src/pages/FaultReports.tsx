import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FaultReportForm } from "@/components/FaultReportForm";

export default function FaultReports() {
  const [showForm, setShowForm] = useState(false);

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
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              No fault reports to display. Click the button above to create your first report.
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Fault Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}