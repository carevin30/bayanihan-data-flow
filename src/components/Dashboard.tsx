import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/StatCard";
import {
  Users,
  Building,
  Calendar,
  FileText,
  Plus,
  Bell,
  Activity,
  TrendingUp,
} from "lucide-react";

// Mock data
const stats = [
  {
    title: "Total Residents",
    value: "2,847",
    icon: Users,
    trend: { value: 2.5, isPositive: true },
  },
  {
    title: "Total Households",
    value: "892",
    icon: Building,
    trend: { value: 1.2, isPositive: true },
  },
  {
    title: "Ongoing Activities",
    value: "12",
    icon: Calendar,
    trend: { value: -5.2, isPositive: false },
  },
  {
    title: "Reports Submitted",
    value: "34",
    icon: FileText,
    trend: { value: 8.3, isPositive: true },
  },
];

const recentActivities = [
  {
    id: 1,
    title: "Community Clean-up Drive",
    status: "Ongoing",
    date: "Dec 15, 2024",
    participants: 45,
  },
  {
    id: 2,
    title: "Senior Citizens Health Check",
    status: "Upcoming",
    date: "Dec 18, 2024",
    participants: 23,
  },
  {
    id: 3,
    title: "Barangay Assembly Meeting",
    status: "Completed",
    date: "Dec 10, 2024",
    participants: 156,
  },
];

const notifications = [
  {
    id: 1,
    message: "New birth registration for Maria Santos",
    time: "2 hours ago",
    type: "info",
  },
  {
    id: 2,
    message: "Barangay clearance request pending approval",
    time: "4 hours ago",
    type: "warning",
  },
  {
    id: 3,
    message: "Monthly report submitted successfully",
    time: "1 day ago",
    type: "success",
  },
];

export default function Dashboard() {
  return (
    <div className="px-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening in your barangay.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </Button>
          <Button size="sm" className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Quick Add
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Population Chart Placeholder */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-primary" />
              Population Distribution
            </CardTitle>
            <CardDescription>
              Breakdown by age groups and zones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-muted/50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Chart visualization coming soon</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2 text-primary" />
              Recent Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {notifications.map((notification) => (
              <div key={notification.id} className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {notification.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {notification.time}
                  </p>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full" size="sm">
              View All Notifications
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-primary" />
                Recent Activities
              </CardTitle>
              <CardDescription>
                Latest barangay programs and events
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-4 bg-muted/30 rounded-lg"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">{activity.title}</h4>
                  <div className="flex items-center space-x-4 mt-1">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        activity.status === "Ongoing"
                          ? "bg-primary/10 text-primary"
                          : activity.status === "Upcoming"
                          ? "bg-warning/10 text-warning"
                          : "bg-success/10 text-success"
                      }`}
                    >
                      {activity.status}
                    </span>
                    <span className="text-sm text-muted-foreground">{activity.date}</span>
                    <span className="text-sm text-muted-foreground">
                      {activity.participants} participants
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  View Details
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}