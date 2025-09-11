import { useState } from "react";
import { Plus, Train, Settings, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Assets() {
  const [assets] = useState([
    {
      id: "T001",
      name: "Metro Train Unit 1",
      type: "Rolling Stock",
      status: "Active",
      location: "Platform 1",
      lastMaintenance: "2024-01-15",
      nextMaintenance: "2024-04-15"
    },
    {
      id: "S002",
      name: "Signal Control System",
      type: "Infrastructure",
      status: "Maintenance",
      location: "Control Room",
      lastMaintenance: "2024-01-10",
      nextMaintenance: "2024-02-10"
    },
    {
      id: "T003",
      name: "Metro Train Unit 2",
      type: "Rolling Stock",
      status: "Active",
      location: "Platform 2",
      lastMaintenance: "2024-01-20",
      nextMaintenance: "2024-04-20"
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-500";
      case "maintenance":
        return "bg-yellow-500";
      case "inactive":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Asset Management</h2>
          <p className="text-muted-foreground">
            Monitor and manage all railway assets
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Asset
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <Train className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assets.length}</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Assets</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {assets.filter(a => a.status === "Active").length}
            </div>
            <p className="text-xs text-muted-foreground">Currently operational</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Due Maintenance</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Scheduled this month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Asset Registry</CardTitle>
          <CardDescription>
            Complete list of all managed assets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assets.map((asset) => (
              <div key={asset.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(asset.status)}`}></div>
                  <div>
                    <h3 className="font-medium">{asset.name}</h3>
                    <p className="text-sm text-muted-foreground">{asset.id} • {asset.type}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-right">
                    <p className="font-medium">{asset.location}</p>
                    <p className="text-muted-foreground">Next: {asset.nextMaintenance}</p>
                  </div>
                  <Badge variant="secondary">{asset.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
