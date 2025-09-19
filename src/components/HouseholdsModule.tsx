import { useState, useEffect } from "react";
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
  Loader2,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Household {
  house_number: string;
  address: string;
  residents: any[];
  total_members: number;
  head_of_household?: string;
  contacts: string[];
}

export default function HouseholdsModule() {
  const [households, setHouseholds] = useState<Household[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [zoneFilter, setZoneFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Fetch residents and group by house number
  const fetchHouseholds = async () => {
    try {
      setLoading(true);
      const { data: residents, error } = await supabase
        .from('residents')
        .select('*')
        .order('house_number', { ascending: true });

      if (error) throw error;

      // Group residents by house number
      const groupedByHouse = residents?.reduce((acc: any, resident: any) => {
        const houseNumber = resident.house_number || 'No House Number';
        
        if (!acc[houseNumber]) {
          acc[houseNumber] = {
            house_number: houseNumber,
            address: resident.address,
            residents: [],
            total_members: 0,
            contacts: []
          };
        }
        
        acc[houseNumber].residents.push(resident);
        acc[houseNumber].total_members += 1;
        
        if (resident.contact && !acc[houseNumber].contacts.includes(resident.contact)) {
          acc[houseNumber].contacts.push(resident.contact);
        }

        // Set head of household (first resident with "Head of Household" status or first resident)
        if (!acc[houseNumber].head_of_household) {
          if (resident.status?.includes("Head of Household")) {
            acc[houseNumber].head_of_household = `${resident.first_name} ${resident.last_name}`;
          } else if (acc[houseNumber].residents.length === 1) {
            acc[houseNumber].head_of_household = `${resident.first_name} ${resident.last_name}`;
          }
        }
        
        return acc;
      }, {}) || {};

      const householdsArray = Object.values(groupedByHouse) as Household[];
      setHouseholds(householdsArray);
    } catch (error) {
      console.error('Error fetching households:', error);
      toast.error('Failed to load households');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHouseholds();
  }, []);

  const filteredHouseholds = households.filter((household) => {
    const matchesSearch = 
      household.house_number?.toString().includes(searchTerm) ||
      household.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      household.head_of_household?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesZone = zoneFilter === "all" || 
      household.address?.toLowerCase().includes(zoneFilter.toLowerCase());
    
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
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading households...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredHouseholds.length === 0 ? (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              {searchTerm || zoneFilter !== "all" 
                ? "No households found matching your search criteria." 
                : "No households found. Add residents with house numbers to see households here."}
            </div>
          ) : (
            filteredHouseholds.map((household, index) => (
              <Card key={household.house_number + index} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center">
                        <Home className="h-4 w-4 mr-2" />
                        House #{household.house_number}
                      </CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {household.address}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {household.total_members} members
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {household.head_of_household && (
                      <div className="flex items-center text-sm">
                        <Users className="h-3 w-3 mr-2 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          Head: <span className="font-medium text-foreground">{household.head_of_household}</span>
                        </span>
                      </div>
                    )}
                    <div className="flex items-center text-sm">
                      <Users className="h-3 w-3 mr-2 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {household.total_members} member{household.total_members > 1 ? 's' : ''}
                      </span>
                    </div>
                    {household.contacts.length > 0 && (
                      <div className="flex items-center text-sm">
                        <Phone className="h-3 w-3 mr-2 text-muted-foreground" />
                        <span className="text-muted-foreground">{household.contacts.join(", ")}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Residents:</p>
                    <div className="space-y-1">
                      {household.residents.slice(0, 3).map((resident, idx) => (
                        <div key={idx} className="text-xs text-muted-foreground">
                          {resident.first_name} {resident.last_name} ({resident.age}y, {resident.gender})
                        </div>
                      ))}
                      {household.residents.length > 3 && (
                        <div className="text-xs text-muted-foreground">
                          +{household.residents.length - 3} more residents
                        </div>
                      )}
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
                        <Users className="h-3 w-3 mr-1" />
                        View All
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Stats Footer */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Showing {filteredHouseholds.length} of {households.length} households
            </span>
            <span>
              Total residents: {households.reduce((sum, h) => sum + h.total_members, 0)}
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