import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const GiveModal = () => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "The account details have been copied to your clipboard.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button
        onClick={() => setIsOpen(true)}
        variant="default"
        className="bg-gold hover:bg-gold/90 text-black"
      >
        Give
      </Button>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Support Our Ministry</DialogTitle>
          <DialogDescription>
            Your generous contribution helps us continue spreading God's word.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Bank Transfer Details</h4>
              <div className="rounded-lg border p-4 space-y-3 bg-gradient-to-r from-purple-50 to-blue-50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Account Name</p>
                    <p className="text-sm text-gray-500">Tetelestai Global</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard("Tetelestai Church")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Account Number</p>
                    <p className="text-sm text-gray-500">1234567890</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard("1234567890")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Bank Name</p>
                    <p className="text-sm text-gray-500">First Bank</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard("First Bank")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Swift Code</p>
                    <p className="text-sm text-gray-500">FBNGNGLA</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard("FBNGNGLA")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Mobile Money</h4>
              <div className="rounded-lg border p-4 space-y-3 bg-gradient-to-r from-gold/10 to-divine/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Phone Number</p>
                    <p className="text-sm text-gray-500">+234 800 123 4567</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard("+234 800 123 4567")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Name</p>
                    <p className="text-sm text-gray-500">Tetelestai Church</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard("Tetelestai Church")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center pt-4">
            <p className="text-sm text-gray-500">
              For any giving inquiries, please contact our finance team at{" "}
              <span className="text-divine">finance@tetelestai.org</span>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GiveModal;
