import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  FileText,
  Loader2,
} from "lucide-react";

// Form schema
const residentFormSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  middle_name: z.string().optional(),
  age: z.number().min(1, "Age must be at least 1").max(150, "Age must be less than 150"),
  gender: z.enum(["Male", "Female"], { message: "Gender is required" }),
  civil_status: z.enum(["Single", "Married", "Widow", "Widower", "Separated"], { message: "Civil status is required" }),
  address: z.string().min(1, "Address is required"),
  house_number: z.string().optional(),
  contact: z.string().optional(),
  occupation: z.string().optional(),
  status: z.array(z.string()),
});

type ResidentFormData = z.infer<typeof residentFormSchema>;

// Available status options
const statusOptions = [
  "Voter",
  "Senior Citizen", 
  "PWD",
  "4Ps Beneficiary",
  "Head of Household",
  "Healthcare Worker",
  "Student",
  "Solo Parent"
];

export default function ResidentsModule() {
  const [residents, setResidents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const form = useForm<ResidentFormData>({
    resolver: zodResolver(residentFormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      middle_name: "",
      age: 0,
      gender: "Male",
      civil_status: "Single",
      address: "",
      house_number: "",
      contact: "",
      occupation: "",
      status: [],
    },
  });

  // Fetch residents from database
  const fetchResidents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('residents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setResidents(data || []);
    } catch (error) {
      console.error('Error fetching residents:', error);
      toast.error('Failed to load residents');
    } finally {
      setLoading(false);
    }
  };

  // Load residents on component mount
  useEffect(() => {
    fetchResidents();
  }, []);

  // Filter residents
  const filteredResidents = residents.filter((resident) => {
    const matchesSearch = 
      resident.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resident.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resident.address?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || 
      resident.status?.some((status: string) => status.toLowerCase().includes(statusFilter.toLowerCase()));
    
    return matchesSearch && matchesStatus;
  });

  // Handle form submission
  const onSubmit = async (data: ResidentFormData) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        toast.error('You must be logged in to add residents');
        return;
      }

      const { error } = await supabase
        .from('residents')
        .insert({
          ...data,
          user_id: user.user.id,
        });

      if (error) throw error;

      toast.success('Resident added successfully');
      setIsAddDialogOpen(false);
      form.reset();
      fetchResidents();
    } catch (error) {
      console.error('Error adding resident:', error);
      toast.error('Failed to add resident');
    }
  };

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
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Resident</DialogTitle>
                <DialogDescription>
                  Fill in the resident's information to add them to the system.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter first name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="last_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter last name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="middle_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Middle Name (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter middle name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="Enter age" 
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Male">Male</SelectItem>
                              <SelectItem value="Female">Female</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="civil_status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Civil Status</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select civil status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Single">Single</SelectItem>
                              <SelectItem value="Married">Married</SelectItem>
                              <SelectItem value="Widow">Widow</SelectItem>
                              <SelectItem value="Widower">Widower</SelectItem>
                              <SelectItem value="Separated">Separated</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="house_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>House Number (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter house number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="contact"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Number (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter contact number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter complete address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="occupation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Occupation (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter occupation" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status (Select all that apply)</FormLabel>
                        <div className="grid grid-cols-2 gap-2">
                          {statusOptions.map((status) => (
                            <div key={status} className="flex items-center space-x-2">
                              <Checkbox
                                id={status}
                                checked={field.value?.includes(status)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    field.onChange([...(field.value || []), status]);
                                  } else {
                                    field.onChange(field.value?.filter((s) => s !== status));
                                  }
                                }}
                              />
                              <label htmlFor={status} className="text-sm font-medium">
                                {status}
                              </label>
                            </div>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsAddDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                      {form.formState.isSubmitting && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Add Resident
                    </Button>
                  </div>
                </form>
              </Form>
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

      {/* Residents Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All Residents</CardTitle>
          <CardDescription>Complete list of registered residents</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading residents...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>House No.</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResidents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      {searchTerm || statusFilter !== "all" 
                        ? "No residents found matching your search criteria." 
                        : "No residents added yet. Click 'Add Resident' to get started."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredResidents.map((resident) => (
                    <TableRow key={resident.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {resident.first_name} {resident.last_name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {resident.gender} • {resident.civil_status}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {resident.house_number || "N/A"}
                      </TableCell>
                      <TableCell className="max-w-xs">
                        {resident.address}
                      </TableCell>
                      <TableCell>{resident.age}</TableCell>
                      <TableCell className="font-mono text-sm">
                        {resident.contact || "N/A"}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {resident.status?.slice(0, 2).map((status: string, index: number) => (
                            <Badge key={index} variant="outline" className={`text-xs ${getStatusColor(status)}`}>
                              {status}
                            </Badge>
                          ))}
                          {resident.status?.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{resident.status.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <FileText className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

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