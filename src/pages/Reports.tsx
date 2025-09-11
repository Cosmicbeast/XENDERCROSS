import { useState } from "react";
import { FileText, Download, Calendar, Filter, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Reports() {
  const [reports] = useState([
    {
      id: "R001",
      title: "Monthly Operations Report",
      type: "Operations",
      generatedDate: "2024-01-30",
      period: "January 2024",
      size: "2.1 MB",
      status: "Ready"
    },
    {
      id: "R002",
      title: "Maintenance Summary",
      type: "Maintenance",
      generatedDate: "2024-01-28",
      period: "Q4 2023",
      size: "1.8 MB",
      status: "Ready"
    },
    {
      id: "R003",
      title: "Safety Incident Report",
      type: "Safety",
      generatedDate: "2024-01-25",
      period: "January 2024",
      size: "856 KB",
      status: "Ready"
    },
    {
      id: "R004",
      title: "Asset Utilization Analysis",
      type: "Analytics",
      generatedDate: "2024-01-20",
      period: "December 2023",
      size: "3.2 MB",
      status: "Processing"
    }
  ]);

  const reportTypes = [
    { name: "Operations", count: 12, color: "bg-blue-500" },
    { name: "Maintenance", count: 8, color: "bg-green-500" },
    { name: "Safety", count: 6, color: "bg-red-500" },
    { name: "Analytics", count: 15, color: "bg-purple-500" }
  ];

  const getTypeColor = (type: string) => {
    const typeMap: Record<string, string> = {
      "Operations": "bg-blue-100 text-blue-800",
      "Maintenance": "bg-green-100 text-green-800",
      "Safety": "bg-red-100 text-red-800",
      "Analytics": "bg-purple-100 text-purple-800"
    };
    return typeMap[type] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Reports & Analytics</h2>
          <p className="text-muted-foreground">
            Generate and manage operational reports
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.length}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ready Reports</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reports.filter(r => r.status === "Ready").length}
            </div>
            <p className="text-xs text-muted-foreground">Available for download</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reports.filter(r => r.status === "Processing").length}
            </div>
            <p className="text-xs text-muted-foreground">Being generated</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Auto-generation scheduled</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Report Categories</CardTitle>
            <CardDescription>
              Distribution of reports by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportTypes.map((type, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${type.color}`}></div>
                    <span className="font-medium">{type.name}</span>
                  </div>
                  <Badge variant="secondary">{type.count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common report generation tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Daily Operations Summary
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="h-4 w-4 mr-2" />
                Weekly Performance Report
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Monthly Maintenance Report
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Export Asset Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>
            Latest generated reports and their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">{report.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {report.period} • Generated on {report.generatedDate}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-right">
                    <p className="font-medium">{report.size}</p>
                    <p className="text-muted-foreground">File size</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${getTypeColor(report.type)}`}>
                      {report.type}
                    </span>
                    {report.status === "Ready" ? (
                      <Button size="sm" variant="outline">
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    ) : (
                      <Badge variant="secondary">{report.status}</Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
