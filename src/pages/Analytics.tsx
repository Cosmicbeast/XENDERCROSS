import { BarChart3, TrendingUp, Activity, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function Analytics() {
  const metrics = [
    {
      title: "System Uptime",
      value: "99.8%",
      change: "+0.2%",
      icon: Activity,
      trend: "up"
    },
    {
      title: "Average Response Time",
      value: "1.2s",
      change: "-0.3s",
      icon: Clock,
      trend: "down"
    },
    {
      title: "Maintenance Efficiency",
      value: "94.5%",
      change: "+2.1%",
      icon: TrendingUp,
      trend: "up"
    },
    {
      title: "Asset Utilization",
      value: "87.3%",
      change: "+1.5%",
      icon: BarChart3,
      trend: "up"
    }
  ];

  const departmentPerformance = [
    { name: "Operations", efficiency: 95, color: "bg-green-500" },
    { name: "Maintenance", efficiency: 88, color: "bg-blue-500" },
    { name: "Security", efficiency: 92, color: "bg-yellow-500" },
    { name: "Customer Service", efficiency: 89, color: "bg-purple-500" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Analytics Dashboard</h2>
        <p className="text-muted-foreground">
          Performance insights and system metrics
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className={`text-xs flex items-center ${
                metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Department Performance</CardTitle>
            <CardDescription>
              Efficiency metrics by department
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {departmentPerformance.map((dept, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{dept.name}</span>
                  <span>{dept.efficiency}%</span>
                </div>
                <Progress value={dept.efficiency} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Trends</CardTitle>
            <CardDescription>
              Key performance indicators over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Fault Reports</p>
                  <p className="text-sm text-muted-foreground">This month</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-xs text-green-600">-23% from last month</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Completed Maintenance</p>
                  <p className="text-sm text-muted-foreground">This month</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">48</p>
                  <p className="text-xs text-green-600">+15% from last month</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Energy Consumption</p>
                  <p className="text-sm text-muted-foreground">This month</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">2.3MW</p>
                  <p className="text-xs text-red-600">+5% from last month</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Health Overview</CardTitle>
          <CardDescription>
            Real-time status of critical systems
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center space-x-3 p-4 border rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="font-medium">Train Operations</p>
                <p className="text-sm text-muted-foreground">All systems operational</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 border rounded-lg">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div>
                <p className="font-medium">Signal Systems</p>
                <p className="text-sm text-muted-foreground">Minor maintenance scheduled</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 border rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="font-medium">Power Systems</p>
                <p className="text-sm text-muted-foreground">Operating normally</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
