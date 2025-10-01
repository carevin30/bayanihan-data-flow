import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  Plus, 
  FileText, 
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  MessageSquare,
  Calendar,
  User,
  Loader2
} from "lucide-react";

export default function ReportsModule() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    reporter_name: '',
    reporter_contact: '',
    location: '',
    priority: 'medium'
  });

  const categories = ['Infrastructure', 'Public Safety', 'Health', 'Environment', 'Animal Control', 'Utilities', 'Others'];

  // Fetch reports
  const { data: reports = [], isLoading } = useQuery({
    queryKey: ['reports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('date_reported', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Add report mutation
  const addReport = useMutation({
    mutationFn: async (newReport: typeof formData) => {
      const ticketNumber = `RPT-${new Date().getFullYear()}-${String(reports.length + 1).padStart(3, '0')}`;
      
      const { data, error } = await supabase
        .from('reports')
        .insert([{
          ...newReport,
          ticket_number: ticketNumber,
          user_id: user?.id,
          status: 'pending',
          date_reported: new Date().toISOString()
        }])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      toast({
        title: "Success",
        description: "Report submitted successfully"
      });
      setIsAddModalOpen(false);
      setFormData({
        title: '',
        category: '',
        description: '',
        reporter_name: '',
        reporter_contact: '',
        location: '',
        priority: 'medium'
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit report",
        variant: "destructive"
      });
      console.error(error);
    }
  });

  const handleSubmit = () => {
    if (!formData.title || !formData.category || !formData.description || !formData.reporter_name) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    addReport.mutate(formData);
  };
  
  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.ticket_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.reporter_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = selectedTab === 'all' || report.status === selectedTab;
    return matchesSearch && matchesTab;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-civic-warning text-civic-warning-foreground';
      case 'in-progress': return 'bg-civic-info text-civic-info-foreground';
      case 'resolved': return 'bg-civic-success text-civic-success-foreground';
      case 'rejected': return 'bg-civic-danger text-civic-danger-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-3 w-3" />;
      case 'in-progress': return <AlertTriangle className="h-3 w-3" />;
      case 'resolved': return <CheckCircle className="h-3 w-3" />;
      case 'rejected': return <XCircle className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Reports & Concerns</h2>
          <p className="text-muted-foreground">Manage resident concerns and generate barangay reports</p>
        </div>
        
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-civic-primary hover:bg-civic-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              New Report
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Submit New Report</DialogTitle>
              <DialogDescription>
                Submit a concern or issue that needs barangay attention.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="report-title" className="text-right">
                  Title *
                </Label>
                <Input 
                  id="report-title" 
                  placeholder="Brief description of the issue" 
                  className="col-span-3"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="report-category" className="text-right">
                  Category *
                </Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="report-priority" className="text-right">
                  Priority *
                </Label>
                <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="reported-by" className="text-right">
                  Reported By *
                </Label>
                <Input 
                  id="reported-by" 
                  placeholder="Your name" 
                  className="col-span-3"
                  value={formData.reporter_name}
                  onChange={(e) => setFormData({...formData, reporter_name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="reporter-contact" className="text-right">
                  Contact
                </Label>
                <Input 
                  id="reporter-contact" 
                  placeholder="Phone or email" 
                  className="col-span-3"
                  value={formData.reporter_contact}
                  onChange={(e) => setFormData({...formData, reporter_contact: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="report-location" className="text-right">
                  Location
                </Label>
                <Input 
                  id="report-location" 
                  placeholder="Location of the issue" 
                  className="col-span-3"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="report-description" className="text-right">
                  Description *
                </Label>
                <Textarea 
                  id="report-description" 
                  placeholder="Detailed description of the issue..." 
                  className="col-span-3 h-24"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="submit" 
                onClick={handleSubmit}
                disabled={addReport.isPending}
              >
                {addReport.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Report
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
              placeholder="Search reports by title, ticket number, or reporter..."
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
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="space-y-4">
          {isLoading ? (
            <Card>
              <CardContent className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Loading reports...</p>
              </CardContent>
            </Card>
          ) : filteredReports.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No reports found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || selectedTab !== 'all' 
                    ? 'Try adjusting your search or tab selection.' 
                    : 'Click "New Report" to submit your first report.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredReports.map((report) => (
                <Card key={report.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">{report.title}</CardTitle>
                          <Badge className={getStatusColor(report.status)}>
                            {getStatusIcon(report.status)}
                            <span className="ml-1 capitalize">{report.status.replace('-', ' ')}</span>
                          </Badge>
                          <Badge variant="outline" className={getPriorityColor(report.priority)}>
                            {report.priority.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {report.ticket_number}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {report.reporter_name}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(report.date_reported).toLocaleDateString()}
                          </span>
                          <Badge variant="outline">{report.category}</Badge>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-sm mb-3">
                      {report.description}
                    </CardDescription>
                    {report.location && (
                      <div className="text-sm text-muted-foreground mb-2">
                        <strong>Location:</strong> {report.location}
                      </div>
                    )}
                    {report.assigned_to && (
                      <div className="text-sm text-muted-foreground mb-2">
                        <strong>Assigned to:</strong> {report.assigned_to}
                      </div>
                    )}
                    {report.notes && (
                      <div className="bg-civic-success/10 border border-civic-success/20 rounded-md p-3 text-sm">
                        <strong className="text-civic-success">Resolution:</strong>
                        <p className="mt-1 text-foreground">{report.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}