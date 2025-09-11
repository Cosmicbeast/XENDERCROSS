import { Train, AlertTriangle, Wrench, TrendingUp, Users, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const stats = [
    {
      title: t("dashboard.totalAssets"),
      value: "24",
      description: "Active train sets",
      icon: Train,
      color: "text-metro-blue",
    },
    {
      title: t("dashboard.activeFaults"),
      value: "7",
      description: "Requiring attention",
      icon: AlertTriangle,
      color: "text-destructive",
    },
    {
      title: t("dashboard.maintenanceDue"),
      value: "12",
      description: "Scheduled today",
      icon: Wrench,
      color: "text-warning",
    },
    {
      title: "System Availability",
      value: "96.2%",
      description: "Last 24 hours",
      icon: TrendingUp,
      color: "text-success",
    },
  ];

  const recentFaults = [
    {
      id: "F-2024-0156",
      asset: "Unit 407",
      description: "Traction converter overheating",
      severity: "major" as const,
      reported: "2 hours ago",
      location: "Aluva Depot",
    },
    {
      id: "F-2024-0155", 
      asset: "Unit 412",
      description: "Door sensor malfunction",
      severity: "minor" as const,
      reported: "4 hours ago",
      location: "Kaloor Station",
    },
    {
      id: "F-2024-0154",
      asset: "Unit 403",
      description: "HVAC system failure",
      severity: "critical" as const,
      reported: "6 hours ago",
      location: "Track Section A-B",
    },
  ];

  const assetStatus = [
    { unit: "Unit 401", status: "operational" as const, location: "In Service - Route 1" },
    { unit: "Unit 402", status: "operational" as const, location: "In Service - Route 2" },
    { unit: "Unit 403", status: "critical" as const, location: "Aluva Depot - Maintenance" },
    { unit: "Unit 404", status: "maintenance" as const, location: "Scheduled Maintenance" },
    { unit: "Unit 405", status: "operational" as const, location: "In Service - Route 1" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Dashboard Overview</h2>
        <p className="text-muted-foreground">
          Real-time monitoring of Karela Metro Rail operations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Recent Fault Reports
            </CardTitle>
            <CardDescription>
              Latest reported issues requiring attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentFaults.map((fault) => (
                <div
                  key={fault.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{fault.id}</Badge>
                      <StatusBadge status={fault.severity} />
                    </div>
                    <p className="font-medium">{fault.asset}</p>
                    <p className="text-sm text-muted-foreground">
                      {fault.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {fault.location} • {fault.reported}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" onClick={() => navigate("/faults")}>
              View All Faults
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Train className="h-5 w-5 text-metro-blue" />
              Asset Status
            </CardTitle>
            <CardDescription>
              Current status of metro train units
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assetStatus.map((asset) => (
                <div
                  key={asset.unit}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{asset.unit}</p>
                    <p className="text-sm text-muted-foreground">
                      {asset.location}
                    </p>
                  </div>
                  <StatusBadge status={asset.status} />
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" onClick={() => navigate("/assets")}>
              View All Assets
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-warning" />
            Quick Actions
          </CardTitle>
          <CardDescription>
            Common tasks and reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-20 flex-col gap-2" onClick={() => navigate("/faults")}>
              <AlertTriangle className="h-6 w-6" />
              Report New Fault
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => navigate("/maintenance")}>
              <Wrench className="h-6 w-6" />
              Schedule Maintenance
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => navigate("/personnel")}>
              <Users className="h-6 w-6" />
              Assign Personnel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}