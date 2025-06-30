// src/pages/Admin/AdminRegistrations.tsx

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, Search, MessageSquare } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

// Import Dialog components for the modal
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

// --- IMPORTANT: Import interfaces and functions from apiAdmin.ts ---
import {
  fetchRegistrations,
  fetchEventsForRegistrationTabs,
  Registration,
  EventDataForTabs,
} from "@/services/apiAdmin";

// Import the custom hook for deleting registrations
import { useDeleteRegistration } from "@/hooks/useRegistration";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const AdminRegistrations = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSpecialRequest, setModalSpecialRequest] = useState("");
  const [modalRegistrantName, setModalRegistrantName] = useState("");

  // --- React Query for Fetching Data ---

  const { data: eventsData, isLoading: isLoadingEvents } = useQuery<
    EventDataForTabs[]
  >({
    queryKey: ["eventsForTabs"],
    queryFn: fetchEventsForRegistrationTabs,
    staleTime: 1000 * 60 * 5,
  });

  const availableEvents = eventsData || [];
  const totalEventsCount = availableEvents.length;

  const {
    data: registrations,
    isLoading: isLoadingRegistrations,
    isError: isErrorRegistrations,
    error: registrationsError,
    refetch: refetchRegistrations,
  } = useQuery<Registration[]>({
    queryKey: ["registrations", { searchQuery, activeTab }],
    queryFn: async () => {
      const params: { [key: string]: string } = {};
      if (searchQuery) params.search = searchQuery;

      if (activeTab !== "all" && eventsData) {
        const selectedEvent = eventsData.find(
          (event) => event.id === activeTab
        );
        if (selectedEvent) {
          params.eventName = selectedEvent.title;
        }
      }
      return fetchRegistrations(params);
    },
    enabled: !!eventsData,
    placeholderData: [],
  });

  // --- Use your custom mutation hooks ---
  const deleteRegistrationMutation = useDeleteRegistration();

  // --- Event Handlers ---

  const handleDeleteRegistration = (_id: string) => {
    if (window.confirm("Are you sure you want to delete this registration?")) {
      deleteRegistrationMutation.mutate(_id);
    }
  };

  const handleViewSpecialRequest = (request: string, name: string) => {
    setModalSpecialRequest(request);
    setModalRegistrantName(name);
    setIsModalOpen(true);
  };

  const downloadCSV = () => {
    if (!registrations || registrations.length === 0) {
      toast({
        title: "No data to export",
        description:
          "There are no registrations matching your current filters.",
        variant: "default",
      });
      return;
    }

    const headers = [
      "ID",
      "Event Name",
      "Full Name",
      "Email",
      "Phone",
      "Number of Attendees",
      "Special Requests",
      "Registration Date",
    ];

    const csvContent = [
      headers.join(","),
      ...registrations.map((reg) =>
        [
          reg.id,
          `"${reg.eventName}"`,
          `"${reg.fullName}"`,
          reg.email,
          reg.phone,
          reg.numberOfAttendees,
          `"${reg.specialRequests.replace(/"/g, '""')}"`,
          new Date(reg.registrationDate).toLocaleDateString(),
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");

    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `registrations-${
        activeTab !== "all"
          ? availableEvents.find((e) => e.id === activeTab)?.title
          : "all"
      }-${new Date().toISOString().slice(0, 10)}.csv`
    );
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Download started",
      description: "Your CSV file is being downloaded.",
    });
  };

  // --- New Function for PDF Download ---
  const downloadPDF = () => {
    if (!registrations || registrations.length === 0) {
      toast({
        title: "No data to export",
        description:
          "There are no registrations matching your current filters.",
        variant: "default",
      });
      return;
    }

    const doc = new jsPDF({
      orientation: "landscape", // 'portrait' or 'landscape'
      unit: "pt", // points, suitable for precise control
      format: "a4", // Page format
    });

    // Define columns for the PDF table
    const columns = [
      { header: "Full Name", dataKey: "fullName" },
      { header: "Email", dataKey: "email" },
      { header: "Phone", dataKey: "phone" },
      { header: "Event", dataKey: "eventName" },
      { header: "Attendees", dataKey: "numberOfAttendees" },
      { header: "Requests", dataKey: "specialRequests" },
      { header: "Reg. Date", dataKey: "registrationDate" },
    ];

    // Prepare rows for the PDF table
    const rows = registrations.map((reg) => ({
      fullName: reg.fullName,
      email: reg.email,
      phone: reg.phone || "N/A", // Handle potential null/empty phone numbers
      eventName: reg.eventName,
      numberOfAttendees: reg.numberOfAttendees,
      specialRequests: reg.specialRequests || "N/A", // Handle potential null/empty requests
      registrationDate: new Date(reg.registrationDate).toLocaleDateString(),
    }));

    const eventNameForTitle =
      activeTab !== "all"
        ? availableEvents.find((e) => e.id === activeTab)?.title
        : "All Events";

    // Add title to the PDF
    doc.setFontSize(16);
    doc.text(`Event Registrations: ${eventNameForTitle}`, 40, 40); // x, y coordinates

    // Generate the table
    // Re-adding the (doc as any) cast for robustness against build system quirks

    autoTable(doc, {
      head: [columns.map((col) => col.header)],
      body: rows.map((row) =>
        columns.map((col) => row[col.dataKey as keyof typeof row])
      ),
      startY: 60,
      theme: "grid",
      styles: {
        fontSize: 8,
        cellPadding: 4,
        overflow: "linebreak",
      },
      headStyles: {
        fillColor: "#8B4513",
        textColor: "#FFFFFF",
        fontStyle: "bold",
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      didParseCell: (data: any) => {
        if (
          data.column.dataKey === "specialRequests" &&
          data.cell.text.length > 0 &&
          data.cell.text[0] === "N/A"
        ) {
          data.cell.styles.textColor = [150, 150, 150];
        }
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      didDrawPage: (data: any) => {
        doc.setFontSize(10);
        doc.text(
          `Page ${data.pageNumber} of ${doc.getNumberOfPages()}`,
          doc.internal.pageSize.width / 2,
          doc.internal.pageSize.height - 20,
          { align: "center" }
        );
      },
    });

    // Save the PDF
    const filename = `registrations-${eventNameForTitle.replace(
      /[^a-zA-Z0-9]/g,
      "_"
    )}-${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(filename);

    toast({
      title: "PDF Download started",
      description: "Your PDF file is being downloaded.",
    });
  };

  // --- Render Functions ---

  const renderRegistrationsTable = () => {
    const tableLoading =
      isLoadingRegistrations || deleteRegistrationMutation.isPending;

    if (tableLoading) {
      return (
        <div className="text-center py-10">
          <p className="text-gray-500">Loading registrations...</p>
        </div>
      );
    }

    if (isErrorRegistrations) {
      return (
        <div className="text-center py-10 text-red-500">
          <p>
            {registrationsError?.message ||
              "Failed to load registrations. Please try again."}
          </p>
          <Button onClick={() => refetchRegistrations()} className="mt-4">
            Retry
          </Button>
        </div>
      );
    }

    // Define table headers with their potential class names
    const tableHeaders = [
      { name: "Full Name", className: "" },
      { name: "Email", className: "" },
      { name: "Phone", className: "" },
      { name: "Event", className: "" },
      { name: "Attendees", className: "text-center" },
      { name: "Date", className: "" },
      { name: "Requests", className: "text-center" },
      { name: "Actions", className: "text-center" },
    ];

    return (
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {/* Added key prop to TableHead components */}
              {tableHeaders.map((header) => (
                <TableHead key={header.name} className={header.className}>
                  {header.name}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {registrations && registrations.length > 0 ? (
              registrations.map((registration) => (
                <TableRow key={registration.fullName}>
                  <TableCell className="font-medium">
                    {registration.fullName}
                  </TableCell>
                  <TableCell>{registration.email}</TableCell>
                  <TableCell>{registration.phone}</TableCell>
                  <TableCell>{registration.eventName}</TableCell>
                  <TableCell className="text-center">
                    {registration.numberOfAttendees}
                  </TableCell>
                  <TableCell>
                    {new Date(
                      registration.registrationDate
                    ).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-center">
                    {registration.specialRequests ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleViewSpecialRequest(
                            registration.specialRequests,
                            registration.fullName
                          )
                        }
                        className="flex items-center gap-1"
                      >
                        <MessageSquare size={16} /> View
                      </Button>
                    ) : (
                      <span className="text-gray-500 text-sm">N/A</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteRegistration(registration._id)}
                      disabled={
                        deleteRegistrationMutation.isPending &&
                        deleteRegistrationMutation.variables ===
                          registration._id
                      }
                    >
                      {deleteRegistrationMutation.isPending &&
                      deleteRegistrationMutation.variables ===
                        registration._id ? (
                        <span className="loading-spinner w-4 h-4" />
                      ) : (
                        "Delete"
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-10 text-gray-500"
                >
                  No registrations found matching your criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
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

        {/* Buttons for export */}
        <div className="flex gap-2">
          <Button
            className="bg-divine hover:bg-divine/90"
            onClick={downloadCSV}
            disabled={
              !registrations ||
              registrations.length === 0 ||
              isLoadingRegistrations ||
              deleteRegistrationMutation.isPending
            }
          >
            <Download size={16} className="mr-2" />
            Export CSV
          </Button>

          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white" // New button for PDF
            onClick={downloadPDF}
            disabled={
              !registrations ||
              registrations.length === 0 ||
              isLoadingRegistrations ||
              deleteRegistrationMutation.isPending
            }
          >
            <Download size={16} className="mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Event Tabs */}
      <Card className="mb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:flex lg:flex-wrap gap-2 p-2 mb-4">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-divine data-[state=active]:text-white"
              disabled={isLoadingEvents}
            >
              All Events ({totalEventsCount})
            </TabsTrigger>
            {isLoadingEvents ? (
              <TabsTrigger value="loading" disabled>
                Loading Events...
              </TabsTrigger>
            ) : (
              availableEvents.map((event) => (
                <TabsTrigger
                  key={event.id} // Ensure event.id is unique for each tab
                  value={event.id}
                  className="data-[state=active]:bg-divine data-[state=active]:text-white"
                >
                  {event.title} ({event.registrations})
                </TabsTrigger>
              ))
            )}
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
                  disabled={
                    isLoadingRegistrations ||
                    deleteRegistrationMutation.isPending
                  }
                />
              </div>
            </div>

            {renderRegistrationsTable()}
          </CardContent>
        </Tabs>
      </Card>

      {/* Special Request Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Special Request from {modalRegistrantName}
            </DialogTitle>
            <DialogDescription>
              Here is the special request message from this registrant.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 px-2 border rounded-md bg-gray-50 max-h-60 overflow-y-auto">
            <p className="text-gray-800 whitespace-pre-wrap">
              {modalSpecialRequest}
            </p>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminRegistrations;
