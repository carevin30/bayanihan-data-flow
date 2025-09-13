import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  FileText,
  Users,
  MapPin,
  Phone,
  Calendar,
} from "lucide-react";

// Mock resident data
const mockResidents = [
  {
    id: 1,
    firstName: "Juan",
    lastName: "Cruz",
    middleName: "Santos",
    age: 34,
    gender: "Male",
    civilStatus: "Married",
    address: "123 Mabini St., Zone 1",
    contact: "09123456789",
    occupation: "Teacher",
    status: ["Voter", "Head of Household"],
    dateRegistered: "2024-01-15",
  },
  {
    id: 2,
    firstName: "Maria",
    lastName: "Garcia",
    middleName: "Lopez",
    age: 67,
    gender: "Female",
    civilStatus: "Widow",
    address: "456 Rizal Ave., Zone 2",
    contact: "09987654321",
    occupation: "Retired",
    status: ["Senior Citizen", "PWD", "4Ps Beneficiary"],
    dateRegistered: "2024-02-20",
  },
  {
    id: 3,
    firstName: "Roberto",
    lastName: "Mendoza",
    middleName: "Rivera",
    age: 28,
    gender: "Male",
    civilStatus: "Single",
    address: "789 Del Pilar St., Zone 3",
    contact: "09876543210",
    occupation: "Construction Worker",
    status: ["Voter"],
    dateRegistered: "2024-03-10",
  },
];

export default function ResidentsModule() {
  const [residents] = useState(mockResidents);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredResidents = residents.filter((resident) => {
    const matchesSearch = 
      resident.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resident.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resident.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || 
      resident.status.some(status => status.toLowerCase().includes(statusFilter.toLowerCase()));
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "senior citizen":
        return "bg-accent/10 text-accent";
      case "pwd":
        return "bg-warning/10 text-warning";
      case "4ps beneficiary":
        return "bg-success/10 text-success";
      case "voter":
        return "bg-primary/10 text-primary";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="px-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Residents Management</h1>
          <p className="text-muted-foreground">
            Manage resident profiles, certificates, and records
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Resident
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Resident</DialogTitle>
                <DialogDescription>
                  Fill in the resident's information to add them to the system.
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="Enter first name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Enter last name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="middleName">Middle Name</Label>
                  <Input id="middleName" placeholder="Enter middle name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input id="age" type="number" placeholder="Enter age" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="civilStatus">Civil Status</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select civil status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="married">Married</SelectItem>
                      <SelectItem value="widow">Widow/Widower</SelectItem>
                      <SelectItem value="separated">Separated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea id="address" placeholder="Enter complete address" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact">Contact Number</Label>
                  <Input id="contact" placeholder="Enter contact number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="occupation">Occupation</Label>
                  <Input id="occupation" placeholder="Enter occupation" />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsAddDialogOpen(false)}>
                  Add Resident
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search residents by name or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Residents</SelectItem>
                  <SelectItem value="senior">Senior Citizens</SelectItem>
                  <SelectItem value="pwd">PWD</SelectItem>
                  <SelectItem value="4ps">4Ps Beneficiaries</SelectItem>
                  <SelectItem value="voter">Voters</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Residents Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredResidents.map((resident) => (
          <Card key={resident.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">
                    {resident.firstName} {resident.lastName}
                  </CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <Users className="h-3 w-3 mr-1" />
                    {resident.age} years old • {resident.gender} • {resident.civilStatus}
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-xs">
                  ID: {resident.id.toString().padStart(4, '0')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <MapPin className="h-3 w-3 mr-2 text-muted-foreground" />
                  <span className="text-muted-foreground">{resident.address}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="h-3 w-3 mr-2 text-muted-foreground" />
                  <span className="text-muted-foreground">{resident.contact}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="h-3 w-3 mr-2 text-muted-foreground" />
                  <span className="text-muted-foreground">Registered: {resident.dateRegistered}</span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Status:</p>
                <div className="flex flex-wrap gap-1">
                  {resident.status.map((status, index) => (
                    <Badge key={index} className={`text-xs ${getStatusColor(status)}`}>
                      {status}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-border">
                <div className="flex justify-between">
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                  <Button variant="outline" size="sm">
                    <FileText className="h-3 w-3 mr-1" />
                    Certificate
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stats Footer */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Showing {filteredResidents.length} of {residents.length} residents
            </span>
            <span>
              Last updated: {new Date().toLocaleDateString()}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}