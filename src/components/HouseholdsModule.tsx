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
  Users,
  MapPin,
  Phone,
  Calendar,
  Home,
} from "lucide-react";

// Mock household data
const mockHouseholds = [
  {
    id: 1,
    houseNumber: "123",
    address: "Mabini St., Zone 1",
    headOfHousehold: "Juan Santos Cruz",
    totalMembers: 4,
    members: ["Juan Santos Cruz", "Maria Cruz", "Jose Cruz", "Ana Cruz"],
    contact: "09123456789",
    electricityConnection: true,
    waterConnection: true,
    sanitationFacility: "Flush toilet",
    monthlyIncome: "₱25,000 - ₱35,000",
    dateRegistered: "2024-01-15",
  },
  {
    id: 2,
    houseNumber: "456",
    address: "Rizal Ave., Zone 2",
    headOfHousehold: "Maria Lopez Garcia",
    totalMembers: 2,
    members: ["Maria Lopez Garcia", "Roberto Garcia"],
    contact: "09987654321",
    electricityConnection: true,
    waterConnection: false,
    sanitationFacility: "Shared latrine",
    monthlyIncome: "₱15,000 - ₱25,000",
    dateRegistered: "2024-02-20",
  },
  {
    id: 3,
    houseNumber: "789",
    address: "Del Pilar St., Zone 3",
    headOfHousehold: "Roberto Rivera Mendoza",
    totalMembers: 1,
    members: ["Roberto Rivera Mendoza"],
    contact: "09876543210",
    electricityConnection: false,
    waterConnection: true,
    sanitationFacility: "Pit latrine",
    monthlyIncome: "₱10,000 - ₱15,000",
    dateRegistered: "2024-03-10",
  },
  {
    id: 4,
    houseNumber: "234",
    address: "Bonifacio St., Zone 1",
    headOfHousehold: "Ana Santos Reyes",
    totalMembers: 3,
    members: ["Ana Santos Reyes", "Carlos Reyes", "Sofia Reyes"],
    contact: "09111222333",
    electricityConnection: true,
    waterConnection: true,
    sanitationFacility: "Flush toilet",
    monthlyIncome: "₱35,000 - ₱50,000",
    dateRegistered: "2024-01-28",
  },
  {
    id: 5,
    houseNumber: "567",
    address: "Lapu-Lapu St., Zone 4",
    headOfHousehold: "Pedro Jose Dela Cruz",
    totalMembers: 2,
    members: ["Pedro Jose Dela Cruz", "Elena Dela Cruz"],
    contact: "09444555666",
    electricityConnection: true,
    waterConnection: true,
    sanitationFacility: "Flush toilet",
    monthlyIncome: "₱20,000 - ₱30,000",
    dateRegistered: "2024-02-05",
  },
];

export default function HouseholdsModule() {
  const [households] = useState(mockHouseholds);
  const [searchTerm, setSearchTerm] = useState("");
  const [zoneFilter, setZoneFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredHouseholds = households.filter((household) => {
    const matchesSearch = 
      household.houseNumber.includes(searchTerm) ||
      household.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      household.headOfHousehold.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesZone = zoneFilter === "all" || 
      household.address.toLowerCase().includes(zoneFilter.toLowerCase());
    
    return matchesSearch && matchesZone;
  });

  const getConnectionStatus = (hasConnection: boolean) => {
    return hasConnection ? 
      "bg-success/10 text-success border-success/20" : 
      "bg-destructive/10 text-destructive border-destructive/20";
  };

  return (
    <div className="px-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Households Management</h1>
          <p className="text-muted-foreground">
            Manage household records, utilities, and member information
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
                Add Household
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Household</DialogTitle>
                <DialogDescription>
                  Register a new household in the barangay system.
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="houseNumber">House Number</Label>
                  <Input id="houseNumber" placeholder="Enter house number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="headOfHousehold">Head of Household</Label>
                  <Input id="headOfHousehold" placeholder="Full name" />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea id="address" placeholder="Street, Zone/Purok" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact">Contact Number</Label>
                  <Input id="contact" placeholder="Enter contact number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="totalMembers">Total Members</Label>
                  <Input id="totalMembers" type="number" placeholder="Number of members" />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsAddDialogOpen(false)}>
                  Add Household
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
                placeholder="Search by house number, address, or head of household..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={zoneFilter} onValueChange={setZoneFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by zone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Zones</SelectItem>
                  <SelectItem value="zone 1">Zone 1</SelectItem>
                  <SelectItem value="zone 2">Zone 2</SelectItem>
                  <SelectItem value="zone 3">Zone 3</SelectItem>
                  <SelectItem value="zone 4">Zone 4</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Households Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredHouseholds.map((household) => (
          <Card key={household.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center">
                    <Home className="h-4 w-4 mr-2" />
                    House #{household.houseNumber}
                  </CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    {household.address}
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-xs">
                  ID: H{household.id.toString().padStart(3, '0')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Users className="h-3 w-3 mr-2 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Head: <span className="font-medium text-foreground">{household.headOfHousehold}</span>
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <Users className="h-3 w-3 mr-2 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {household.totalMembers} member{household.totalMembers > 1 ? 's' : ''}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="h-3 w-3 mr-2 text-muted-foreground" />
                  <span className="text-muted-foreground">{household.contact}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="h-3 w-3 mr-2 text-muted-foreground" />
                  <span className="text-muted-foreground">Registered: {household.dateRegistered}</span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Utilities:</p>
                <div className="flex flex-wrap gap-2">
                  <Badge className={`text-xs ${getConnectionStatus(household.electricityConnection)}`}>
                    Electricity: {household.electricityConnection ? 'Connected' : 'No Connection'}
                  </Badge>
                  <Badge className={`text-xs ${getConnectionStatus(household.waterConnection)}`}>
                    Water: {household.waterConnection ? 'Connected' : 'No Connection'}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  Sanitation: {household.sanitationFacility}
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium">Monthly Income:</p>
                <Badge variant="outline" className="text-xs">
                  {household.monthlyIncome}
                </Badge>
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
                    <Users className="h-3 w-3 mr-1" />
                    Members
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
              Showing {filteredHouseholds.length} of {households.length} households
            </span>
            <span>
              Total residents: {households.reduce((sum, h) => sum + h.totalMembers, 0)}
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