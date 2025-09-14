import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Plus, 
  Calendar, 
  MapPin, 
  Users, 
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";

interface Activity {
  id: string;
  title: string;
  type: string;
  description: string;
  date: string;
  time: string;
  location: string;
  budget: number;
  attendees: number;
  maxAttendees?: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  organizer: string;
}

const mockActivities: Activity[] = [
  {
    id: '1',
    title: 'Community Clean-up Drive',
    type: 'Environmental',
    description: 'Monthly barangay clean-up activity focusing on public areas and waterways',
    date: '2024-03-15',
    time: '06:00 AM',
    location: 'Barangay Hall - Main Street',
    budget: 5000,
    attendees: 45,
    maxAttendees: 100,
    status: 'upcoming',
    organizer: 'Environment Committee'
  },
  {
    id: '2',
    title: 'Feeding Program for Children',
    type: 'Social Services',
    description: 'Monthly feeding program for malnourished children in the barangay',
    date: '2024-03-10',
    time: '10:00 AM',
    location: 'Day Care Center',
    budget: 15000,
    attendees: 80,
    maxAttendees: 120,
    status: 'ongoing',
    organizer: 'Health Committee'
  },
  {
    id: '3',
    title: 'Vaccination Drive - COVID-19 Booster',
    type: 'Health',
    description: 'Free COVID-19 booster vaccination for senior citizens and high-risk individuals',
    date: '2024-02-28',
    time: '09:00 AM',
    location: 'Covered Court',
    budget: 8000,
    attendees: 150,
    status: 'completed',
    organizer: 'Health Committee'
  }
];

export default function ActivitiesModule() {
  const [activities] = useState<Activity[]>(mockActivities);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const activityTypes = ['Environmental', 'Health', 'Social Services', 'Education', 'Sports', 'Cultural'];
  
  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = selectedTab === 'all' || activity.status === selectedTab;
    return matchesSearch && matchesTab;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-civic-info text-civic-info-foreground';
      case 'ongoing': return 'bg-civic-warning text-civic-warning-foreground';
      case 'completed': return 'bg-civic-success text-civic-success-foreground';
      case 'cancelled': return 'bg-civic-danger text-civic-danger-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'upcoming': return <Clock className="h-3 w-3" />;
      case 'ongoing': return <AlertCircle className="h-3 w-3" />;
      case 'completed': return <CheckCircle className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Activities & Programs</h2>
          <p className="text-muted-foreground">Manage barangay events, programs, and community activities</p>
        </div>
        
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-civic-primary hover:bg-civic-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Activity
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Activity</DialogTitle>
              <DialogDescription>
                Create a new barangay activity or program.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="activity-title" className="text-right">
                  Title
                </Label>
                <Input id="activity-title" placeholder="Activity title" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="activity-type" className="text-right">
                  Type
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {activityTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="activity-date" className="text-right">
                  Date & Time
                </Label>
                <div className="col-span-3 flex gap-2">
                  <Input id="activity-date" type="date" className="flex-1" />
                  <Input id="activity-time" type="time" className="flex-1" />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="activity-location" className="text-right">
                  Location
                </Label>
                <Input id="activity-location" placeholder="Event location" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="activity-budget" className="text-right">
                  Budget
                </Label>
                <Input id="activity-budget" type="number" placeholder="0" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="activity-description" className="text-right">
                  Description
                </Label>
                <Textarea id="activity-description" placeholder="Activity description..." className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={() => setIsAddModalOpen(false)}>
                Save Activity
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search activities by title or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Status Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="space-y-4">
          <div className="grid gap-4">
            {filteredActivities.map((activity) => (
              <Card key={activity.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{activity.title}</CardTitle>
                        <Badge className={getStatusColor(activity.status)}>
                          {getStatusIcon(activity.status)}
                          <span className="ml-1 capitalize">{activity.status}</span>
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(activity.date).toLocaleDateString()} at {activity.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {activity.location}
                        </span>
                        <Badge variant="outline">{activity.type}</Badge>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-sm mb-4">
                    {activity.description}
                  </CardDescription>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{activity.attendees}</span>
                        {activity.maxAttendees && <span className="text-muted-foreground">/ {activity.maxAttendees}</span>}
                        <span className="text-muted-foreground">attendees</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span>₱{activity.budget.toLocaleString()}</span>
                        <span className="text-muted-foreground">budget</span>
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Organized by {activity.organizer}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredActivities.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No activities found</h3>
                <p className="text-muted-foreground">Try adjusting your search or tab selection.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}