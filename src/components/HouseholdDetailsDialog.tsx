import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Users, MapPin, Phone, Home, Zap, Droplets, Wifi, Banknote } from "lucide-react";

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

interface HouseholdDetailsDialogProps {
  household: Household | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function HouseholdDetailsDialog({
  household,
  open,
  onOpenChange,
}: HouseholdDetailsDialogProps) {
  if (!household) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Home className="h-5 w-5 mr-2" />
            House #{household.house_number} Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              Address Information
            </h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Address:</span> {household.address}</p>
              <p><span className="font-medium">House Number:</span> {household.house_number}</p>
              <p><span className="font-medium">Total Members:</span> {household.total_members}</p>
              {household.head_of_household && (
                <p><span className="font-medium">Head of Household:</span> {household.head_of_household}</p>
              )}
              {household.contacts.length > 0 && (
                <div className="flex items-center">
                  <Phone className="h-3 w-3 mr-2" />
                  <span className="font-medium">Contacts:</span>
                  <span className="ml-1">{household.contacts.join(", ")}</span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Utilities */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center">
              <Zap className="h-4 w-4 mr-2" />
              Utilities
            </h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant={household.utilities?.electricity ? "default" : "secondary"} className="flex items-center">
                <Zap className="h-3 w-3 mr-1" />
                Electricity: {household.utilities?.electricity ? "Connected" : "Not Connected"}
              </Badge>
              <Badge variant={household.utilities?.water ? "default" : "secondary"} className="flex items-center">
                <Droplets className="h-3 w-3 mr-1" />
                Water: {household.utilities?.water ? "Connected" : "Not Connected"}
              </Badge>
              <Badge variant={household.utilities?.internet ? "default" : "secondary"} className="flex items-center">
                <Wifi className="h-3 w-3 mr-1" />
                Internet: {household.utilities?.internet ? "Connected" : "Not Connected"}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Income Information */}
          {household.monthly_income && (
            <>
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center">
                  <Banknote className="h-4 w-4 mr-2" />
                  Financial Information
                </h3>
                <p className="text-sm">
                  <span className="font-medium">Monthly Income:</span> ₱{household.monthly_income.toLocaleString()}
                </p>
              </div>
              <Separator />
            </>
          )}

          {/* Residents List */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Household Members
            </h3>
            <div className="space-y-3">
              {household.residents.map((resident, index) => (
                <div key={index} className="border rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">
                      {resident.first_name} {resident.middle_name} {resident.last_name}
                    </h4>
                    <Badge variant="outline">{resident.age} years old</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <p>Gender: {resident.gender}</p>
                    <p>Civil Status: {resident.civil_status}</p>
                    <p>Occupation: {resident.occupation || "N/A"}</p>
                    {resident.contact && <p>Contact: {resident.contact}</p>}
                  </div>
                  {resident.status && resident.status.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {resident.status.map((status: string, idx: number) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {status}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}