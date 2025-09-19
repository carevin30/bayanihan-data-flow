import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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

interface EditResidentDialogProps {
  resident: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export default function EditResidentDialog({ 
  resident, 
  isOpen, 
  onClose, 
  onUpdate 
}: EditResidentDialogProps) {
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    if (resident) {
      form.reset({
        first_name: resident.first_name || "",
        last_name: resident.last_name || "",
        middle_name: resident.middle_name || "",
        age: resident.age || 0,
        gender: resident.gender || "Male",
        civil_status: resident.civil_status || "Single",
        address: resident.address || "",
        house_number: resident.house_number || "",
        contact: resident.contact || "",
        occupation: resident.occupation || "",
        status: resident.status || [],
      });
    }
  }, [resident, form]);

  const onSubmit = async (data: ResidentFormData) => {
    if (!resident) return;
    
    try {
      setLoading(true);
      const { error } = await supabase
        .from('residents')
        .update(data)
        .eq('id', resident.id);

      if (error) throw error;

      toast.success('Resident updated successfully');
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating resident:', error);
      toast.error('Failed to update resident');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Resident</DialogTitle>
          <DialogDescription>
            Update the resident's information.
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
                    <Select onValueChange={field.onChange} value={field.value}>
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
                    <Select onValueChange={field.onChange} value={field.value}>
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
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" />
                Update Resident
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}