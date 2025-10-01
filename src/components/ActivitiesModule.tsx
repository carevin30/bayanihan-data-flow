import { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Activity {
  id: string;
  title: string;
  type: string;
  description: string | null;
  date: string;
  location: string;
  budget: number | null;
  attendees: number;
  max_attendees?: number | null;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  organizer: string;
  contact: string | null;
}

export default function ActivitiesModule() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    location: '',
    budget: '',
    max_attendees: '',
    organizer: '',
    contact: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch activities",
        variant: "destructive"
      });
      return;
    }

    setActivities((data || []) as Activity[]);
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.type || !formData.date || !formData.location || !formData.organizer) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to add activities",
        variant: "destructive"
      });
      return;
    }

    const activityDateTime = `${formData.date}T${formData.time}:00`;

    const { error } = await supabase.from('activities').insert({
      user_id: user.id,
      title: formData.title,
      type: formData.type,
      description: formData.description,
      date: activityDateTime,
      location: formData.location,
      budget: formData.budget ? parseFloat(formData.budget) : null,
      attendees: 0,
      max_attendees: formData.max_attendees ? parseInt(formData.max_attendees) : null,
      organizer: formData.organizer,
      contact: formData.contact,
      status: 'upcoming'
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add activity",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Success",
      description: "Activity added successfully"
    });

    setIsAddModalOpen(false);
    setFormData({
      title: '',
      type: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      time: '09:00',
      location: '',
      budget: '',
      max_attendees: '',
      organizer: '',
      contact: ''
    });
    fetchActivities();
  };

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
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Activities & Programs</h2>
          <p className="text-muted-foreground">Manage barangay events, programs, and community activities</p>
        </div>
        
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-civic-primary hover:bg-civic-primary/90 shrink-0">
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
                  <Input 
                    id="activity-title" 
                    placeholder="Activity title" 
                    className="col-span-3"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="activity-type" className="text-right">
                    Type
                  </Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
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
                    <Input 
                      id="activity-date" 
                      type="date" 
                      className="flex-1"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                    />
                    <Input 
                      id="activity-time" 
                      type="time" 
                      className="flex-1"
                      value={formData.time}
                      onChange={(e) => setFormData({...formData, time: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="activity-location" className="text-right">
                    Location
                  </Label>
                  <Input 
                    id="activity-location" 
                    placeholder="Event location" 
                    className="col-span-3"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="activity-organizer" className="text-right">
                    Organizer
                  </Label>
                  <Input 
                    id="activity-organizer" 
                    placeholder="Organizing committee" 
                    className="col-span-3"
                    value={formData.organizer}
                    onChange={(e) => setFormData({...formData, organizer: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="activity-contact" className="text-right">
                    Contact
                  </Label>
                  <Input 
                    id="activity-contact" 
                    placeholder="Contact number" 
                    className="col-span-3"
                    value={formData.contact}
                    onChange={(e) => setFormData({...formData, contact: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="activity-budget" className="text-right">
                    Budget
                  </Label>
                  <Input 
                    id="activity-budget" 
                    type="number" 
                    placeholder="0" 
                    className="col-span-3"
                    value={formData.budget}
                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="activity-max-attendees" className="text-right">
                    Max Attendees
                  </Label>
                  <Input 
                    id="activity-max-attendees" 
                    type="number" 
                    placeholder="Optional" 
                    className="col-span-3"
                    value={formData.max_attendees}
                    onChange={(e) => setFormData({...formData, max_attendees: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="activity-description" className="text-right">
                    Description
                  </Label>
                  <Textarea 
                    id="activity-description" 
                    placeholder="Activity description..." 
                    className="col-span-3"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
              </div>
            <DialogFooter>
              <Button type="submit" onClick={handleSubmit}>
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
                          {new Date(activity.date).toLocaleString()}
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
                          {activity.max_attendees && <span className="text-muted-foreground">/ {activity.max_attendees}</span>}
                          <span className="text-muted-foreground">attendees</span>
                        </span>
                        {activity.budget && (
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <span>₱{activity.budget.toLocaleString()}</span>
                            <span className="text-muted-foreground">budget</span>
                          </span>
                        )}
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