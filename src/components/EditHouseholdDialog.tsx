import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Home, Zap, Droplets, Wifi, Banknote, Save, X } from "lucide-react";
import { toast } from "sonner";

interface Household {
  house_number: string;
  address: string;
  residents: any[];
  total_members: number;
  head_of_household?: string;
  contacts: string[];
  utilities?: {
    electricity: boolean;
    water: boolean;
    internet: boolean;
  };
  monthly_income?: number;
}

interface EditHouseholdDialogProps {
  household: Household | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updatedHousehold: Household) => void;
}

export default function EditHouseholdDialog({
  household,
  open,
  onOpenChange,
  onSave,
}: EditHouseholdDialogProps) {
  const [formData, setFormData] = useState({
    address: "",
    utilities: {
      electricity: false,
      water: false,
      internet: false,
    },
    monthly_income: "",
  });

  useEffect(() => {
    if (household) {
      setFormData({
        address: household.address || "",
        utilities: {
          electricity: household.utilities?.electricity || false,
          water: household.utilities?.water || false,
          internet: household.utilities?.internet || false,
        },
        monthly_income: household.monthly_income?.toString() || "",
      });
    }
  }, [household]);

  const handleSave = () => {
    if (!household) return;

    const updatedHousehold: Household = {
      ...household,
      address: formData.address,
      utilities: formData.utilities,
      monthly_income: formData.monthly_income ? parseFloat(formData.monthly_income) : undefined,
    };

    onSave(updatedHousehold);
    onOpenChange(false);
    toast.success("Household information updated successfully");
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

  if (!household) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Home className="h-5 w-5 mr-2" />
            Edit House #{household.house_number}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
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
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}