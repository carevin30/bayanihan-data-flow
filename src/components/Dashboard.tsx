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
  BarChart3,
} from "lucide-react";

// Mock data
const stats = [
  {
    title: "Total Residents",
    value: "2,847",
    change: "+2.5%",
    icon: Users,
    trend: "up" as const,
  },
  {
    title: "Total Households",
    value: "892",
    change: "+1.2%", 
    icon: Building,
    trend: "up" as const,
  },
  {
    title: "Ongoing Activities",
    value: "12",
    change: "-5.2%",
    icon: Calendar,
    trend: "down" as const,
  },
  {
    title: "Reports Submitted",
    value: "34",
    change: "+8.3%",
    icon: FileText,
    trend: "up" as const,
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
  },
  {
    id: 2,
    message: "Barangay clearance request pending approval",
    time: "4 hours ago",
  },
  {
    id: 3,
    message: "Monthly report submitted successfully",
    time: "1 day ago",
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary-glow/10 rounded-3xl blur-3xl -z-10" />
        <div className="relative bg-gradient-to-r from-card/80 to-card/60 backdrop-blur-sm rounded-2xl p-8 border border-border/50 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-muted-foreground mt-2 text-lg">
                Welcome to your barangay management system
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" className="flex items-center space-x-2 h-11 px-6 rounded-xl border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200">
                <Bell className="h-4 w-4" />
                <span>Notifications</span>
              </Button>
              <Button className="flex items-center space-x-2 h-11 px-6 rounded-xl bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 transition-opacity shadow-lg shadow-primary/25">
                <Plus className="h-4 w-4" />
                <span>Quick Add</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="transform hover:scale-105 transition-transform duration-200">
            <StatCard {...stat} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Population Distribution Chart */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-card/95 to-card/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold">Population Distribution</CardTitle>
              <CardDescription className="text-base">
                Demographic breakdown by age groups
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-muted-foreground bg-gradient-to-br from-muted/30 to-transparent rounded-xl border border-border/30 backdrop-blur-sm">
                <div className="text-center space-y-2">
                  <BarChart3 className="w-12 h-12 mx-auto text-primary/60" />
                  <p className="text-lg font-medium">Chart Coming Soon</p>
                  <p className="text-sm">Population analytics will be displayed here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Notifications */}
        <div className="space-y-6">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-card/95 to-card/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold flex items-center space-x-2">
                <Bell className="w-5 h-5 text-primary" />
                <span>Recent Notifications</span>
              </CardTitle>
              <CardDescription className="text-base">Latest updates and alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {notifications.map((notification, index) => (
                <div key={index} className="group p-4 rounded-xl bg-gradient-to-r from-accent/30 to-transparent border border-border/30 hover:border-primary/30 transition-all duration-200 hover:shadow-md">
                  <div className="flex items-start space-x-3">
                    <div className="w-3 h-3 bg-gradient-to-r from-primary to-primary-glow rounded-full mt-1.5 flex-shrink-0 shadow-sm" />
                    <div className="flex-1">
                      <p className="text-sm text-foreground font-medium">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-4 h-11 rounded-xl border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200">
                View All Notifications
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activities */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-card/95 to-card/80 backdrop-blur-sm">
        <CardHeader className="pb-6">
          <CardTitle className="text-xl font-semibold flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-primary" />
            <span>Recent Activities</span>
          </CardTitle>
          <CardDescription className="text-base">Latest barangay activities and events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="group p-5 rounded-xl bg-gradient-to-r from-accent/20 to-transparent border border-border/30 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary-glow/20 rounded-xl flex items-center justify-center shadow-sm">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-lg">{activity.title}</h4>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
                          activity.status === 'Completed' ? 'bg-gradient-to-r from-success/20 to-success/10 text-success border border-success/20' :
                          activity.status === 'Ongoing' ? 'bg-gradient-to-r from-primary/20 to-primary/10 text-primary border border-primary/20' :
                          'bg-gradient-to-r from-warning/20 to-warning/10 text-warning border border-warning/20'
                        }`}>
                          {activity.status}
                        </span>
                        <span className="text-sm text-muted-foreground font-medium">{activity.date}</span>
                        <span className="text-sm text-muted-foreground">
                          {activity.participants} participants
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-primary/10 hover:text-primary rounded-xl">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}