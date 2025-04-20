
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Download, Search, Filter } from 'lucide-react';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";

// Sample registration data - in a real app, this would come from an API/database
const registrations = [
  {
    id: '1',
    eventName: 'Annual Conference 2024',
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '555-123-4567',
    registrationDate: '2024-05-10',
    status: 'confirmed'
  },
  {
    id: '2',
    eventName: 'Youth Retreat',
    name: 'Emily Johnson',
    email: 'emily.j@example.com',
    phone: '555-987-6543',
    registrationDate: '2024-05-15',
    status: 'confirmed'
  },
  {
    id: '3',
    eventName: 'Annual Conference 2024',
    name: 'Michael Brown',
    email: 'michael.b@example.com',
    phone: '555-555-5555',
    registrationDate: '2024-05-11',
    status: 'pending'
  },
  {
    id: '4',
    eventName: 'Prayer Conference',
    name: 'Sarah Williams',
    email: 'sarah.w@example.com',
    phone: '555-222-3333',
    registrationDate: '2024-05-18',
    status: 'confirmed'
  },
  {
    id: '5',
    eventName: 'Youth Retreat',
    name: 'David Miller',
    email: 'david.m@example.com',
    phone: '555-444-7777',
    registrationDate: '2024-05-16',
    status: 'cancelled'
  },
  {
    id: '6',
    eventName: 'Prayer Conference',
    name: 'Jessica Taylor',
    email: 'jessica.t@example.com',
    phone: '555-888-9999',
    registrationDate: '2024-05-17',
    status: 'confirmed'
  }
];

const eventNames = [...new Set(registrations.map(reg => reg.eventName))];
const statuses = [...new Set(registrations.map(reg => reg.status))];

const AdminRegistrations = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [activeTab, setActiveTab] = useState('all');

  // Filter registrations
  const filteredRegistrations = registrations.filter(registration => {
    const matchesSearch = 
      registration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      registration.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      registration.phone.includes(searchQuery);
    
    const matchesEvent = activeTab === 'all' || registration.eventName === activeTab;
    const matchesStatus = selectedStatus === 'all' || registration.status === selectedStatus;
    
    return matchesSearch && matchesEvent && matchesStatus;
  });

  const downloadCSV = () => {
    // Create CSV content
    const headers = ['ID', 'Event Name', 'Name', 'Email', 'Phone', 'Registration Date', 'Status'];
    
    const csvContent = [
      headers.join(','),
      ...filteredRegistrations.map(reg => 
        [
          reg.id,
          `"${reg.eventName}"`,
          `"${reg.name}"`,
          reg.email,
          reg.phone,
          reg.registrationDate,
          reg.status
        ].join(',')
      )
    ].join('\n');
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `registrations-${activeTab}-${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download started",
      description: "Your CSV file is being downloaded.",
    });
  };

  // Count registrations by event and status
  const countRegistrations = (event: string, status?: string) => {
    return registrations.filter(reg => 
      (event === 'all' || reg.eventName === event) && 
      (status === undefined || status === 'all' || reg.status === status)
    ).length;
  };

  const renderRegistrationsTable = () => {
    return (
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Event</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRegistrations.map((registration) => (
              <TableRow key={registration.id}>
                <TableCell className="font-medium">{registration.name}</TableCell>
                <TableCell>{registration.email}</TableCell>
                <TableCell>{registration.phone}</TableCell>
                <TableCell>{registration.eventName}</TableCell>
                <TableCell>{registration.registrationDate}</TableCell>
                <TableCell className="text-center">
                  <span className={`px-2 py-1 text-xs rounded-full capitalize ${
                    registration.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                    registration.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {registration.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {filteredRegistrations.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">No registrations found</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Event Registrations</h1>
          <p className="text-gray-500">Manage registrations for all events</p>
        </div>
        
        <Button 
          className="bg-divine hover:bg-divine/90"
          onClick={downloadCSV}
        >
          <Download size={16} className="mr-2" />
          Export CSV
        </Button>
      </div>
      
      {/* Event Tabs */}
      <Card className="mb-6">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:flex lg:flex-wrap gap-2 p-2 mb-4">
            <TabsTrigger value="all" className="data-[state=active]:bg-divine data-[state=active]:text-white">
              All Events ({countRegistrations('all')})
            </TabsTrigger>
            {eventNames.map(event => (
              <TabsTrigger 
                key={event} 
                value={event}
                className="data-[state=active]:bg-divine data-[state=active]:text-white"
              >
                {event} ({countRegistrations(event)})
              </TabsTrigger>
            ))}
          </TabsList>
          
          <CardContent className="pt-0">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, email, or phone..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {renderRegistrationsTable()}
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default AdminRegistrations;
