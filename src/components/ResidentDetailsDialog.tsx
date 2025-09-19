import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, MapPin, Phone, Briefcase, Calendar, Users } from "lucide-react";

interface ResidentDetailsDialogProps {
  resident: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function ResidentDetailsDialog({ 
  resident, 
  isOpen, 
  onClose 
}: ResidentDetailsDialogProps) {
  if (!resident) return null;

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Resident Details
          </DialogTitle>
          <DialogDescription>
            Complete information for {resident.first_name} {resident.last_name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                <p className="text-sm">
                  {resident.first_name} {resident.middle_name ? resident.middle_name + ' ' : ''}{resident.last_name}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Age</label>
                <p className="text-sm">{resident.age} years old</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Gender</label>
                <p className="text-sm">{resident.gender}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Civil Status</label>
                <p className="text-sm">{resident.civil_status}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Contact & Address Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact & Address</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Address</label>
                  <p className="text-sm">{resident.address}</p>
                </div>
              </div>
              {resident.house_number && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">House Number</label>
                  <p className="text-sm font-mono">{resident.house_number}</p>
                </div>
              )}
              {resident.contact && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Contact</label>
                    <p className="text-sm font-mono">{resident.contact}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Work & Status Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Additional Information</h3>
            <div className="space-y-3">
              {resident.occupation && (
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Occupation</label>
                    <p className="text-sm">{resident.occupation}</p>
                  </div>
                </div>
              )}
              
              {resident.status && resident.status.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {resident.status.map((status: string, index: number) => (
                      <Badge key={index} variant="outline" className={`text-xs ${getStatusColor(status)}`}>
                        {status}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Date Registered</label>
                  <p className="text-sm">
                    {new Date(resident.date_registered || resident.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}