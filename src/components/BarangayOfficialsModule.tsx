import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Plus, Edit, UserCheck, Phone, Mail, Calendar, Clock, LogIn, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Official {
  id: string;
  name: string;
  position: string;
  term: string;
  contact: string;
  email: string;
  status: "on_duty" | "off_duty" | "active" | "inactive";
  time_in?: string;
  time_out?: string;
  photo_url?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}


export default function BarangayOfficialsModule() {
  const [officials, setOfficials] = useState<Official[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOfficial, setEditingOfficial] = useState<Official | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    term: "2023-2026",
    contact: "",
    email: ""
  });

  useEffect(() => {
    fetchOfficials();
  }, []);

  const fetchOfficials = async () => {
    try {
      const { data, error } = await supabase
        .from("officials")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOfficials((data || []) as Official[]);
    } catch (error) {
      console.error("Error fetching officials:", error);
      toast({
        title: "Error",
        description: "Failed to fetch officials",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredOfficials = officials.filter((official) => {
    const matchesSearch = official.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         official.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || official.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddOfficial = () => {
    setEditingOfficial(null);
    setFormData({
      name: "",
      position: "",
      term: "2023-2026",
      contact: "",
      email: ""
    });
    setIsDialogOpen(true);
  };

  const handleEditOfficial = (official: Official) => {
    setEditingOfficial(official);
    setFormData({
      name: official.name,
      position: official.position,
      term: official.term,
      contact: official.contact || "",
      email: official.email || ""
    });
    setIsDialogOpen(true);
  };

  const handleTimeIn = async (officialId: string) => {
    try {
      const { error } = await supabase
        .from("officials")
        .update({
          status: "on_duty",
          time_in: new Date().toISOString(),
          time_out: null
        })
        .eq("id", officialId);

      if (error) throw error;
      
      await fetchOfficials();
      toast({
        title: "Success",
        description: "Official timed in successfully",
      });
    } catch (error) {
      console.error("Error timing in:", error);
      toast({
        title: "Error",
        description: "Failed to time in",
        variant: "destructive",
      });
    }
  };

  const handleTimeOut = async (officialId: string) => {
    try {
      const { error } = await supabase
        .from("officials")
        .update({
          status: "off_duty",
          time_out: new Date().toISOString()
        })
        .eq("id", officialId);

      if (error) throw error;
      
      await fetchOfficials();
      toast({
        title: "Success",
        description: "Official timed out successfully",
      });
    } catch (error) {
      console.error("Error timing out:", error);
      toast({
        title: "Error",
        description: "Failed to time out",
        variant: "destructive",
      });
    }
  };

  const handleSaveOfficial = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to manage officials",
          variant: "destructive",
        });
        return;
      }

      const officialData = {
        ...formData,
        user_id: user.id,
        status: editingOfficial ? editingOfficial.status : "off_duty"
      };

      if (editingOfficial) {
        const { error } = await supabase
          .from("officials")
          .update(officialData)
          .eq("id", editingOfficial.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("officials")
          .insert([officialData]);
        
        if (error) throw error;
      }

      await fetchOfficials();
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: `Official ${editingOfficial ? "updated" : "added"} successfully`,
      });
    } catch (error) {
      console.error("Error saving official:", error);
      toast({
        title: "Error",
        description: `Failed to ${editingOfficial ? "update" : "add"} official`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Barangay Officials</h1>
        <p className="text-muted-foreground">Manage official profiles and council structure</p>
      </div>

      {/* Council Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Officials</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{officials.length}</div>
            <p className="text-xs text-muted-foreground">Active council members</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Current Term</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">2023-2026</div>
            <p className="text-xs text-muted-foreground">3-year term period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Positions Filled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">6/7</div>
            <p className="text-xs text-muted-foreground">Active positions</p>
          </CardContent>
        </Card>
      </div>

      {/* Officials Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Officials Directory</CardTitle>
              <CardDescription>Complete list of barangay officials and their contact information</CardDescription>
            </div>
            <Button onClick={handleAddOfficial} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Official
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search officials..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="on_duty">On Duty</SelectItem>
                <SelectItem value="off_duty">Off Duty</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Officials Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Official</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Term</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Time In/Out</TableHead>
                  <TableHead className="w-32">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOfficials.map((official) => (
                  <TableRow key={official.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={official.photo_url} />
                          <AvatarFallback>
                            {official.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{official.name}</div>
                          <div className="text-sm text-muted-foreground">{official.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{official.position}</TableCell>
                    <TableCell>{official.term}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Phone className="h-3 w-3" />
                        {official.contact}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={official.status === "on_duty" ? "default" : "secondary"}>
                        {official.status === "on_duty" ? "On Duty" : official.status === "off_duty" ? "Off Duty" : official.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs space-y-1">
                        {official.time_in && (
                          <div className="flex items-center gap-1">
                            <LogIn className="h-3 w-3 text-green-600" />
                            <span>In: {format(new Date(official.time_in), "HH:mm")}</span>
                          </div>
                        )}
                        {official.time_out && (
                          <div className="flex items-center gap-1">
                            <LogOut className="h-3 w-3 text-red-600" />
                            <span>Out: {format(new Date(official.time_out), "HH:mm")}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {official.status === "off_duty" ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleTimeIn(official.id)}
                            className="h-8 w-8 p-0"
                          >
                            <LogIn className="h-3 w-3" />
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleTimeOut(official.id)}
                            className="h-8 w-8 p-0"
                          >
                            <LogOut className="h-3 w-3" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditOfficial(official)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {!loading && filteredOfficials.length === 0 && (
            <div className="text-center py-8">
              <UserCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold">No officials found</h3>
              <p className="text-muted-foreground">
                {officials.length === 0 ? "No officials added yet. Click 'Add Official' to get started." : "No officials match your search criteria."}
              </p>
            </div>
          )}
          
          {loading && (
            <div className="text-center py-8">
              <div className="text-muted-foreground">Loading officials...</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Official Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingOfficial ? "Edit Official" : "Add New Official"}
            </DialogTitle>
            <DialogDescription>
              {editingOfficial ? "Update official information" : "Add a new barangay official to the directory"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter full name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="position">Position</Label>
              <Select value={formData.position} onValueChange={(value) => setFormData(prev => ({ ...prev, position: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Barangay Captain">Barangay Captain</SelectItem>
                  <SelectItem value="Kagawad - Health">Kagawad - Health</SelectItem>
                  <SelectItem value="Kagawad - Education">Kagawad - Education</SelectItem>
                  <SelectItem value="Kagawad - Infrastructure">Kagawad - Infrastructure</SelectItem>
                  <SelectItem value="Kagawad - Peace & Order">Kagawad - Peace & Order</SelectItem>
                  <SelectItem value="Secretary">Secretary</SelectItem>
                  <SelectItem value="Treasurer">Treasurer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="contact">Contact Number</Label>
              <Input
                id="contact"
                placeholder="09XXXXXXXXX"
                value={formData.contact}
                onChange={(e) => setFormData(prev => ({ ...prev, contact: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="official@barangay.gov.ph"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="term">Term Period</Label>
              <Input
                id="term"
                placeholder="2023-2026"
                value={formData.term}
                onChange={(e) => setFormData(prev => ({ ...prev, term: e.target.value }))}
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={() => setIsDialogOpen(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSaveOfficial} className="flex-1">
                {editingOfficial ? "Update" : "Add"} Official
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}