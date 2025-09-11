import { useState } from "react";
import { Plus, Wrench, Clock, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function Maintenance() {
  const [maintenanceTasks] = useState([
    {
      id: "M001",
      asset: "Metro Train Unit 1",
      task: "Brake System Inspection",
      priority: "High",
      status: "In Progress",
      assignedTo: "John Smith",
      dueDate: "2024-01-25",
      progress: 65
    },
    {
      id: "M002",
      asset: "Signal Control System",
      task: "Software Update",
      priority: "Medium",
      status: "Scheduled",
      assignedTo: "Sarah Johnson",
      dueDate: "2024-02-10",
      progress: 0
    },
    {
      id: "M003",
      asset: "Platform Safety System",
      task: "Sensor Calibration",
      priority: "Low",
      status: "Completed",
      assignedTo: "Mike Wilson",
      dueDate: "2024-01-20",
      progress: 100
    }
  ]);

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "in progress":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "scheduled":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Maintenance Management</h2>
          <p className="text-muted-foreground">
            Schedule and track maintenance activities
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Schedule Maintenance
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{maintenanceTasks.length}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {maintenanceTasks.filter(t => t.status === "In Progress").length}
            </div>
            <p className="text-xs text-muted-foreground">Active tasks</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {maintenanceTasks.filter(t => t.status === "Completed").length}
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {maintenanceTasks.filter(t => t.priority === "High").length}
            </div>
            <p className="text-xs text-muted-foreground">Urgent tasks</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Maintenance Schedule</CardTitle>
          <CardDescription>
            Current and upcoming maintenance activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {maintenanceTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(task.status)}
                  <div>
                    <h3 className="font-medium">{task.task}</h3>
                    <p className="text-sm text-muted-foreground">{task.asset} • {task.assignedTo}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-right min-w-[120px]">
                    <p className="font-medium">Due: {task.dueDate}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Progress value={task.progress} className="w-16 h-2" />
                      <span className="text-xs">{task.progress}%</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`}></div>
                    <Badge variant="secondary">{task.status}</Badge>
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
