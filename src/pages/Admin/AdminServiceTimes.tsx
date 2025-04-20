
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow
} from "@/components/ui/table";
import { 
  Plus, Pencil, Trash2, Calendar, Clock 
} from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

// Sample service times data
const initialServiceTimes = [
  {
    id: '1',
    type: 'weekly',
    name: 'Sunday Worship Service',
    day: 'Sunday',
    time: '10:00 AM',
    description: 'Our main worship service with praise, prayer, and teaching.',
    location: 'Main Sanctuary'
  },
  {
    id: '2',
    type: 'weekly',
    name: 'Wednesday Bible Study',
    day: 'Wednesday',
    time: '7:00 PM',
    description: 'Mid-week Bible study and prayer meeting.',
    location: 'Fellowship Hall'
  },
  {
    id: '3',
    type: 'weekly',
    name: 'Youth Service',
    day: 'Friday',
    time: '6:30 PM',
    description: 'Service specially designed for teenagers and young adults.',
    location: 'Youth Center'
  },
  {
    id: '4',
    type: 'monthly',
    name: 'Communion Service',
    day: 'First Sunday',
    time: '10:00 AM',
    description: 'Monthly communion celebration during main service.',
    location: 'Main Sanctuary'
  },
  {
    id: '5',
    type: 'monthly',
    name: 'Leadership Meeting',
    day: 'Last Saturday',
    time: '9:00 AM',
    description: 'Monthly gathering of ministry leaders to plan and align vision.',
    location: 'Conference Room'
  },
  {
    id: '6',
    type: 'special',
    name: 'Christmas Eve Service',
    day: 'December 24',
    time: '7:00 PM',
    description: 'Special candlelight service celebrating the birth of Christ.',
    location: 'Main Sanctuary'
  }
];

const serviceTypes = ["weekly", "monthly", "special"];
const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

interface ServiceTime {
  id: string;
  type: string;
  name: string;
  day: string;
  time: string;
  description: string;
  location: string;
}

const AdminServiceTimes = () => {
  const [serviceTimes, setServiceTimes] = useState<ServiceTime[]>(initialServiceTimes);
  const [selectedType, setSelectedType] = useState("weekly");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceTime | null>(null);
  const [deletingServiceId, setDeletingServiceId] = useState<string | null>(null);

  // Form state
  const [serviceName, setServiceName] = useState("");
  const [serviceDay, setServiceDay] = useState("Sunday");
  const [serviceTime, setServiceTime] = useState("");
  const [serviceDesc, setServiceDesc] = useState("");
  const [serviceLocation, setServiceLocation] = useState("");
  const [serviceType, setServiceType] = useState("weekly");

  const filteredServices = serviceTimes.filter(service => service.type === selectedType);

  const handleAddNew = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleEdit = (service: ServiceTime) => {
    setEditingService(service);
    setServiceName(service.name);
    setServiceDay(service.day);
    setServiceTime(service.time);
    setServiceDesc(service.description);
    setServiceLocation(service.location);
    setServiceType(service.type);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeletingServiceId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deletingServiceId) {
      setServiceTimes(serviceTimes.filter(service => service.id !== deletingServiceId));
      setIsDeleteDialogOpen(false);
      setDeletingServiceId(null);
      toast({
        title: "Service time deleted",
        description: "The service time has been removed.",
      });
    }
  };

  const resetForm = () => {
    setEditingService(null);
    setServiceName("");
    setServiceDay("Sunday");
    setServiceTime("");
    setServiceDesc("");
    setServiceLocation("");
    setServiceType("weekly");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!serviceName || !serviceDay || !serviceTime) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (editingService) {
      // Update existing service
      setServiceTimes(serviceTimes.map(service => 
        service.id === editingService.id ? {
          ...service,
          name: serviceName,
          day: serviceDay,
          time: serviceTime,
          description: serviceDesc,
          location: serviceLocation,
          type: serviceType
        } : service
      ));
      toast({
        title: "Service updated",
        description: "The service time has been updated.",
      });
    } else {
      // Add new service
      const newService = {
        id: String(Date.now()),
        name: serviceName,
        day: serviceDay,
        time: serviceTime,
        description: serviceDesc,
        location: serviceLocation,
        type: serviceType
      };
      setServiceTimes([...serviceTimes, newService]);
      toast({
        title: "Service added",
        description: "New service time has been added.",
      });
    }

    setIsDialogOpen(false);
    resetForm();
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Service Times</h1>
          <p className="text-gray-500">Manage church service schedules and activities</p>
        </div>
        
        <Button 
          className="bg-divine hover:bg-divine/90"
          onClick={handleAddNew}
        >
          <Plus size={16} className="mr-2" />
          Add New Service
        </Button>
      </div>
      
      <Tabs defaultValue="weekly" value={selectedType} onValueChange={setSelectedType}>
        <TabsList className="mb-4">
          <TabsTrigger value="weekly">Weekly Services</TabsTrigger>
          <TabsTrigger value="monthly">Monthly Services</TabsTrigger>
          <TabsTrigger value="special">Special Services</TabsTrigger>
        </TabsList>
        
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service Name</TableHead>
                  <TableHead>Day</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServices.length > 0 ? (
                  filteredServices.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell className="font-medium">
                        {service.name}
                        <p className="font-normal text-xs text-gray-500 mt-1">
                          {service.description}
                        </p>
                      </TableCell>
                      <TableCell>{service.day}</TableCell>
                      <TableCell>{service.time}</TableCell>
                      <TableCell>{service.location}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => handleEdit(service)}
                          >
                            <Pencil size={14} />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => handleDelete(service.id)}
                            className="text-destructive"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-gray-500">
                      No services found. Click "Add New Service" to create one.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Tabs>
      
      {/* Add/Edit Service Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingService ? "Edit Service" : "Add New Service"}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="serviceType">Service Type</Label>
              <Select value={serviceType} onValueChange={setServiceType}>
                <SelectTrigger id="serviceType">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {serviceTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="serviceName">Service Name*</Label>
              <Input
                id="serviceName"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                placeholder="e.g., Sunday Worship Service"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="serviceDay">Day*</Label>
                {serviceType === "weekly" ? (
                  <Select value={serviceDay} onValueChange={setServiceDay}>
                    <SelectTrigger id="serviceDay">
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent>
                      {weekDays.map((day) => (
                        <SelectItem key={day} value={day}>{day}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id="serviceDay"
                    value={serviceDay}
                    onChange={(e) => setServiceDay(e.target.value)}
                    placeholder={serviceType === "monthly" ? "e.g., First Sunday" : "e.g., December 25"}
                    required
                  />
                )}
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="serviceTime">Time*</Label>
                <Input
                  id="serviceTime"
                  value={serviceTime}
                  onChange={(e) => setServiceTime(e.target.value)}
                  placeholder="e.g., 10:00 AM"
                  required
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="serviceLocation">Location</Label>
              <Input
                id="serviceLocation"
                value={serviceLocation}
                onChange={(e) => setServiceLocation(e.target.value)}
                placeholder="e.g., Main Sanctuary"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="serviceDesc">Description</Label>
              <Textarea
                id="serviceDesc"
                value={serviceDesc}
                onChange={(e) => setServiceDesc(e.target.value)}
                placeholder="Brief description of the service"
                rows={3}
              />
            </div>
            
            <DialogFooter className="mt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsDialogOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-divine hover:bg-divine/90"
              >
                {editingService ? "Update" : "Add"} Service
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Service Time</DialogTitle>
          </DialogHeader>
          <p className="py-4">
            Are you sure you want to delete this service time? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminServiceTimes;
