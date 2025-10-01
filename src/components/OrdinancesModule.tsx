import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Plus, 
  Download, 
  Calendar, 
  FileText, 
  Filter,
  Eye
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Ordinance {
  id: string;
  number: string;
  title: string;
  category: string;
  date_enacted: string;
  description: string | null;
  status: 'active' | 'amended' | 'repealed';
}

export default function OrdinancesModule() {
  const [ordinances, setOrdinances] = useState<Ordinance[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    number: '',
    title: '',
    category: '',
    description: '',
    date_enacted: new Date().toISOString().split('T')[0]
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchOrdinances();
  }, []);

  const fetchOrdinances = async () => {
    const { data, error } = await supabase
      .from('ordinances')
      .select('*')
      .order('date_enacted', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch ordinances",
        variant: "destructive"
      });
      return;
    }

    setOrdinances((data || []) as Ordinance[]);
  };

  const handleSubmit = async () => {
    if (!formData.number || !formData.title || !formData.category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to add ordinances",
        variant: "destructive"
      });
      return;
    }

    const { error } = await supabase.from('ordinances').insert({
      user_id: user.id,
      number: formData.number,
      title: formData.title,
      category: formData.category,
      description: formData.description,
      date_enacted: formData.date_enacted,
      status: 'active'
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add ordinance",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Success",
      description: "Ordinance added successfully"
    });

    setIsAddModalOpen(false);
    setFormData({
      number: '',
      title: '',
      category: '',
      description: '',
      date_enacted: new Date().toISOString().split('T')[0]
    });
    fetchOrdinances();
  };

  const categories = ['all', 'Environment', 'Business', 'Public Safety', 'Health', 'Transportation'];
  
  const filteredOrdinances = ordinances.filter(ordinance => {
    const matchesSearch = ordinance.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ordinance.number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || ordinance.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-civic-success text-civic-success-foreground';
      case 'superseded': return 'bg-civic-warning text-civic-warning-foreground';
      case 'repealed': return 'bg-civic-danger text-civic-danger-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Ordinances & Policies</h2>
          <p className="text-muted-foreground">Digital library of barangay resolutions and ordinances</p>
        </div>
        
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-civic-primary hover:bg-civic-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Ordinance
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Ordinance</DialogTitle>
              <DialogDescription>
                Create a new barangay ordinance or policy document.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="ordinance-number" className="text-right">
                  Number
                </Label>
                <Input 
                  id="ordinance-number" 
                  placeholder="ORD-2024-003" 
                  className="col-span-3"
                  value={formData.number}
                  onChange={(e) => setFormData({...formData, number: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="ordinance-title" className="text-right">
                  Title
                </Label>
                <Input 
                  id="ordinance-title" 
                  placeholder="Ordinance title" 
                  className="col-span-3"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="ordinance-category" className="text-right">
                  Category
                </Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.slice(1).map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="ordinance-date" className="text-right">
                  Date Enacted
                </Label>
                <Input 
                  id="ordinance-date" 
                  type="date"
                  className="col-span-3"
                  value={formData.date_enacted}
                  onChange={(e) => setFormData({...formData, date_enacted: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="ordinance-description" className="text-right">
                  Description
                </Label>
                <Textarea 
                  id="ordinance-description" 
                  placeholder="Brief description..." 
                  className="col-span-3"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleSubmit}>
                Save Ordinance
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search ordinances by title or number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>
                      {cat === 'all' ? 'All Categories' : cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ordinances Grid */}
      <div className="grid gap-4">
        {filteredOrdinances.map((ordinance) => (
          <Card key={ordinance.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{ordinance.title}</CardTitle>
                    <Badge className={getStatusColor(ordinance.status)}>
                      {ordinance.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      {ordinance.number}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(ordinance.date_enacted).toLocaleDateString()}
                    </span>
                    <Badge variant="outline">{ordinance.category}</Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    PDF
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-sm">
                {ordinance.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOrdinances.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No ordinances found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}