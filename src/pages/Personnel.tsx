import { useState } from "react";
import { Plus, Users, Clock, Award, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Personnel() {
  const [personnel] = useState([
    {
      id: "P001",
      name: "John Smith",
      position: "Train Operator",
      department: "Operations",
      status: "On Duty",
      shift: "Morning (06:00-14:00)",
      email: "john.smith@kmrl.com",
      phone: "+91-9876543210",
      experience: "5 years"
    },
    {
      id: "P002",
      name: "Sarah Johnson",
      position: "Maintenance Engineer",
      department: "Maintenance",
      status: "On Leave",
      shift: "Day (08:00-17:00)",
      email: "sarah.johnson@kmrl.com",
      phone: "+91-9876543211",
      experience: "8 years"
    },
    {
      id: "P003",
      name: "Mike Wilson",
      position: "Security Officer",
      department: "Security",
      status: "On Duty",
      shift: "Night (22:00-06:00)",
      email: "mike.wilson@kmrl.com",
      phone: "+91-9876543212",
      experience: "3 years"
    },
    {
      id: "P004",
      name: "Emily Davis",
      position: "Station Manager",
      department: "Operations",
      status: "On Duty",
      shift: "Day (09:00-18:00)",
      email: "emily.davis@kmrl.com",
      phone: "+91-9876543213",
      experience: "12 years"
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "on duty":
        return "bg-green-500";
      case "off duty":
        return "bg-gray-500";
      case "on leave":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const getDepartmentStats = () => {
    const departments = personnel.reduce((acc, person) => {
      acc[person.department] = (acc[person.department] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return departments;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Personnel Management</h2>
          <p className="text-muted-foreground">
            Manage staff schedules and assignments
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Personnel
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{personnel.length}</div>
            <p className="text-xs text-muted-foreground">Active employees</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On Duty</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {personnel.filter(p => p.status === "On Duty").length}
            </div>
            <p className="text-xs text-muted-foreground">Currently working</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.keys(getDepartmentStats()).length}
            </div>
            <p className="text-xs text-muted-foreground">Active departments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Operations</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {personnel.filter(p => p.department === "Operations").length}
            </div>
            <p className="text-xs text-muted-foreground">Operations staff</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Department Distribution</CardTitle>
            <CardDescription>
              Staff distribution across departments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(getDepartmentStats()).map(([dept, count]) => (
                <div key={dept} className="flex items-center justify-between">
                  <span className="font-medium">{dept}</span>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">{count}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Shift Overview</CardTitle>
            <CardDescription>
              Current shift assignments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Morning Shift</p>
                  <p className="text-sm text-muted-foreground">06:00 - 14:00</p>
                </div>
                <Badge variant="secondary">
                  {personnel.filter(p => p.shift.includes("Morning")).length}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Day Shift</p>
                  <p className="text-sm text-muted-foreground">08:00 - 17:00</p>
                </div>
                <Badge variant="secondary">
                  {personnel.filter(p => p.shift.includes("Day")).length}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Night Shift</p>
                  <p className="text-sm text-muted-foreground">22:00 - 06:00</p>
                </div>
                <Badge variant="secondary">
                  {personnel.filter(p => p.shift.includes("Night")).length}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Staff Directory</CardTitle>
          <CardDescription>
            Complete personnel information and contact details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {personnel.map((person) => (
              <div key={person.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarFallback>{person.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{person.name}</h3>
                    <p className="text-sm text-muted-foreground">{person.position} • {person.department}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        <span>{person.email}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        <span>{person.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-right">
                    <p className="font-medium">{person.shift}</p>
                    <p className="text-muted-foreground">{person.experience} experience</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(person.status)}`}></div>
                    <Badge variant="secondary">{person.status}</Badge>
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
