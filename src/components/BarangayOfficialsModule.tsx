import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Plus, Edit, UserCheck, Phone, Mail, Calendar } from "lucide-react";

interface Official {
  id: string;
  name: string;
  position: string;
  term: string;
  contact: string;
  email: string;
  status: "active" | "inactive";
  photo?: string;
}

const mockOfficials: Official[] = [
  {
    id: "1",
    name: "Maria Santos",
    position: "Barangay Captain",
    term: "2023-2026",
    contact: "09123456789",
    email: "captain@barangay.gov.ph",
    status: "active",
  },
  {
    id: "2",
    name: "Juan Dela Cruz",
    position: "Kagawad - Health",
    term: "2023-2026", 
    contact: "09234567890",
    email: "health@barangay.gov.ph",
    status: "active",
  },
  {
    id: "3",
    name: "Ana Rodriguez",
    position: "Kagawad - Education",
    term: "2023-2026",
    contact: "09345678901",
    email: "education@barangay.gov.ph", 
    status: "active",
  },
  {
    id: "4",
    name: "Pedro Gonzales",
    position: "Kagawad - Infrastructure",
    term: "2023-2026",
    contact: "09456789012",
    email: "infrastructure@barangay.gov.ph",
    status: "active",
  },
  {
    id: "5",
    name: "Lisa Reyes",
    position: "Secretary",
    term: "2023-2026",
    contact: "09567890123",
    email: "secretary@barangay.gov.ph",
    status: "active",
  },
  {
    id: "6",
    name: "Carlos Mendoza",
    position: "Treasurer",
    term: "2023-2026",
    contact: "09678901234",
    email: "treasurer@barangay.gov.ph",
    status: "active",
  },
];

export default function BarangayOfficialsModule() {
  const [officials, setOfficials] = useState<Official[]>(mockOfficials);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOfficial, setEditingOfficial] = useState<Official | null>(null);

  const filteredOfficials = officials.filter((official) => {
    const matchesSearch = official.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         official.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || official.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddOfficial = () => {
    setEditingOfficial(null);
    setIsDialogOpen(true);
  };

  const handleEditOfficial = (official: Official) => {
    setEditingOfficial(official);
    setIsDialogOpen(true);
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
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOfficials.map((official) => (
                  <TableRow key={official.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={official.photo} />
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
                      <Badge variant={official.status === "active" ? "default" : "secondary"}>
                        {official.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditOfficial(official)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredOfficials.length === 0 && (
            <div className="text-center py-8">
              <UserCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold">No officials found</h3>
              <p className="text-muted-foreground">No officials match your search criteria.</p>
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
                defaultValue={editingOfficial?.name || ""}
              />
            </div>
            <div>
              <Label htmlFor="position">Position</Label>
              <Select defaultValue={editingOfficial?.position || ""}>
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
                defaultValue={editingOfficial?.contact || ""}
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="official@barangay.gov.ph"
                defaultValue={editingOfficial?.email || ""}
              />
            </div>
            <div>
              <Label htmlFor="term">Term Period</Label>
              <Input
                id="term"
                placeholder="2023-2026"
                defaultValue={editingOfficial?.term || "2023-2026"}
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={() => setIsDialogOpen(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button onClick={() => setIsDialogOpen(false)} className="flex-1">
                {editingOfficial ? "Update" : "Add"} Official
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}