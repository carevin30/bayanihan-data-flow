import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Home, Zap, Droplets, Wifi, Banknote, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface AddHouseholdDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function AddHouseholdDialog({
  open,
  onOpenChange,
  onSuccess,
}: AddHouseholdDialogProps) {
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    house_number: "",
    address: "",
    utilities: {
      electricity: false,
      water: false,
      internet: false,
    },
    monthly_income: "",
  });

  const handleSave = async () => {
    if (!formData.house_number.trim()) {
      toast.error("House number is required");
      return;
    }

    if (!formData.address.trim()) {
      toast.error("Address is required");
      return;
    }

    try {
      setSaving(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to add household data");
        return;
      }

      // Prepare the data for database
      const householdData = {
        house_number: formData.house_number.trim(),
        address: formData.address.trim(),
        user_id: user.id,
        utilities: formData.utilities,
        monthly_income: formData.monthly_income ? parseFloat(formData.monthly_income) : null,
      };

      // Insert new household record
      const { error } = await supabase
        .from('households')
        .insert(householdData);

      if (error) {
        console.error('Error adding household data:', error);
        if (error.code === '23505') {
          toast.error("A household with this house number already exists");
        } else {
          toast.error("Failed to add household information");
        }
        return;
      }

      // Reset form
      setFormData({
        house_number: "",
        address: "",
        utilities: {
          electricity: false,
          water: false,
          internet: false,
        },
        monthly_income: "",
      });

      onOpenChange(false);
      onSuccess();
      toast.success("Household added successfully");
    } catch (error) {
      console.error('Error adding household:', error);
      toast.error("Failed to add household information");
    } finally {
      setSaving(false);
    }
  };

  const handleUtilityChange = (utility: keyof typeof formData.utilities, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      utilities: {
        ...prev.utilities,
        [utility]: checked,
      },
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Home className="h-5 w-5 mr-2" />
            Add New Household
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* House Number */}
          <div className="space-y-2">
            <Label htmlFor="house_number">House Number *</Label>
            <Input
              id="house_number"
              value={formData.house_number}
              onChange={(e) => setFormData(prev => ({ ...prev, house_number: e.target.value }))}
              placeholder="Enter house number"
            />
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              placeholder="Street, Zone/Purok"
              className="min-h-[80px]"
            />
          </div>

          {/* Utilities */}
          <div className="space-y-3">
            <Label className="text-base font-semibold flex items-center">
              <Zap className="h-4 w-4 mr-2" />
              Utilities
            </Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="electricity"
                  checked={formData.utilities.electricity}
                  onCheckedChange={(checked) => handleUtilityChange("electricity", checked as boolean)}
                />
                <Label htmlFor="electricity" className="flex items-center cursor-pointer">
                  <Zap className="h-4 w-4 mr-2" />
                  Electricity Connection
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="water"
                  checked={formData.utilities.water}
                  onCheckedChange={(checked) => handleUtilityChange("water", checked as boolean)}
                />
                <Label htmlFor="water" className="flex items-center cursor-pointer">
                  <Droplets className="h-4 w-4 mr-2" />
                  Water Connection
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="internet"
                  checked={formData.utilities.internet}
                  onCheckedChange={(checked) => handleUtilityChange("internet", checked as boolean)}
                />
                <Label htmlFor="internet" className="flex items-center cursor-pointer">
                  <Wifi className="h-4 w-4 mr-2" />
                  Internet Connection
                </Label>
              </div>
            </div>
          </div>

          {/* Monthly Income */}
          <div className="space-y-2">
            <Label htmlFor="monthly_income" className="flex items-center">
              <Banknote className="h-4 w-4 mr-2" />
              Monthly Income (₱)
            </Label>
            <Input
              id="monthly_income"
              type="number"
              value={formData.monthly_income}
              onChange={(e) => setFormData(prev => ({ ...prev, monthly_income: e.target.value }))}
              placeholder="Enter monthly household income"
              min="0"
              step="0.01"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />}
            <Plus className="h-4 w-4 mr-2" />
            {saving ? "Adding..." : "Add Household"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}