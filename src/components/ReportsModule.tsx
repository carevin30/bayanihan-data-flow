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
  FileText, 
  Download, 
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  MessageSquare,
  Calendar,
  User
} from "lucide-react";

interface Report {
  id: string;
  ticketNumber: string;
  title: string;
  category: string;
  description: string;
  reportedBy: string;
  dateSubmitted: string;
  status: 'pending' | 'in-progress' | 'resolved' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: string;
  resolution?: string;
}

const mockReports: Report[] = [
  {
    id: '1',
    ticketNumber: 'RPT-2024-001',
    title: 'Broken Street Light on Rizal Street',
    category: 'Infrastructure',
    description: 'The street light near house #45 has been broken for 3 days, causing safety concerns for residents walking at night.',
    reportedBy: 'Maria Santos',
    dateSubmitted: '2024-03-01',
    status: 'in-progress',
    priority: 'high',
    assignedTo: 'Public Works Committee'
  },
  {
    id: '2',
    ticketNumber: 'RPT-2024-002',
    title: 'Noise Complaint - Construction Work',
    category: 'Public Safety',
    description: 'Construction work starting at 5 AM daily causing disturbance to residents. Work permits need verification.',
    reportedBy: 'Juan dela Cruz',
    dateSubmitted: '2024-03-05',
    status: 'pending',
    priority: 'medium'
  },
  {
    id: '3',
    ticketNumber: 'RPT-2024-003',
    title: 'Stray Dogs in Residential Area',
    category: 'Animal Control',
    description: 'Pack of stray dogs roaming the streets causing concern for children safety.',
    reportedBy: 'Ana Rodriguez',
    dateSubmitted: '2024-02-28',
    status: 'resolved',
    priority: 'medium',
    assignedTo: 'Health Committee',
    resolution: 'Coordinated with city pound. Dogs have been safely captured and relocated.'
  }
];

export default function ReportsModule() {
  const [reports] = useState<Report[]>(mockReports);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const categories = ['Infrastructure', 'Public Safety', 'Health', 'Environment', 'Animal Control', 'Utilities', 'Others'];
  
  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.reportedBy.toLowerCase().includes(searchTerm.toLowerCase());
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

  const generateMonthlyReport = () => {
    // Mock function for generating reports
    console.log('Generating monthly report...');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Reports & Concerns</h2>
          <p className="text-muted-foreground">Manage resident concerns and generate barangay reports</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={generateMonthlyReport}>
            <Download className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
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
                    Title
                  </Label>
                  <Input id="report-title" placeholder="Brief description of the issue" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="report-category" className="text-right">
                    Category
                  </Label>
                  <Select>
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
                    Priority
                  </Label>
                  <Select>
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
                    Reported By
                  </Label>
                  <Input id="reported-by" placeholder="Your name" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="report-description" className="text-right">
                    Description
                  </Label>
                  <Textarea id="report-description" placeholder="Detailed description of the issue..." className="col-span-3 h-24" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={() => setIsAddModalOpen(false)}>
                  Submit Report
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
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
                          {report.ticketNumber}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {report.reportedBy}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(report.dateSubmitted).toLocaleDateString()}
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
                  {report.assignedTo && (
                    <div className="text-sm text-muted-foreground mb-2">
                      <strong>Assigned to:</strong> {report.assignedTo}
                    </div>
                  )}
                  {report.resolution && (
                    <div className="bg-civic-success/10 border border-civic-success/20 rounded-md p-3 text-sm">
                      <strong className="text-civic-success">Resolution:</strong>
                      <p className="mt-1 text-foreground">{report.resolution}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredReports.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No reports found</h3>
                <p className="text-muted-foreground">Try adjusting your search or tab selection.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}