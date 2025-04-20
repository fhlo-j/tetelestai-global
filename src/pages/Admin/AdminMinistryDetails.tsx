
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Plus, Save, Trash2 } from 'lucide-react';
import ImageUploader from '@/components/ImageUploader';
import { toast } from "@/hooks/use-toast";

interface Ministry {
  id: string;
  title: string;
  desc: string;
  fullDescription: string;
  goals: string[];
  activities: string[];
  getInvolved: string;
  imageUrl: string;
  bannerUrl: string;
}

const AdminMinistryDetails = () => {
  const [ministries, setMinistries] = useState<Ministry[]>([
    {
      id: "worship",
      title: "Worship",
      desc: "Engaging the presence of God through anointed praise and worship.",
      fullDescription: "Our worship ministry is dedicated to creating an atmosphere where people can encounter the presence of God through anointed music and praise.",
      goals: [
        "To create an atmosphere where people can encounter God's presence",
        "To express authentic worship that honors God"
      ],
      activities: [
        "Sunday worship services",
        "Worship nights"
      ],
      getInvolved: "If you have musical talents or technical skills and a heart for worship, we'd love to have you join our worship team.",
      imageUrl: "https://images.unsplash.com/photo-1492321936769-b49830bc1d1e",
      bannerUrl: "https://images.unsplash.com/photo-1492321936769-b49830bc1d1e"
    }
  ]);

  const [editingMinistry, setEditingMinistry] = useState<Ministry | null>(null);

  const handleSave = (ministry: Ministry) => {
    setMinistries(prev =>
      prev.map(m => m.id === ministry.id ? ministry : m)
    );
    toast({
      title: "Ministry updated",
      description: "The ministry details have been successfully updated.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Ministry Management</h1>
        <Button className="bg-divine hover:bg-divine/90">
          <Plus size={16} className="mr-2" />
          Add Ministry
        </Button>
      </div>

      {ministries.map(ministry => (
        <Card key={ministry.id}>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">{ministry.title}</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <Textarea 
                      defaultValue={ministry.desc}
                      className="h-24"
                      onChange={(e) => {
                        const updatedMinistry = { ...ministry, desc: e.target.value };
                        handleSave(updatedMinistry);
                      }}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Description</label>
                    <Textarea 
                      defaultValue={ministry.fullDescription}
                      className="h-32"
                      onChange={(e) => {
                        const updatedMinistry = { ...ministry, fullDescription: e.target.value };
                        handleSave(updatedMinistry);
                      }}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Goals</label>
                    {ministry.goals.map((goal, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <Input
                          value={goal}
                          onChange={(e) => {
                            const newGoals = [...ministry.goals];
                            newGoals[index] = e.target.value;
                            const updatedMinistry = { ...ministry, goals: newGoals };
                            handleSave(updatedMinistry);
                          }}
                        />
                        <Button 
                          variant="destructive" 
                          size="icon"
                          onClick={() => {
                            const newGoals = ministry.goals.filter((_, i) => i !== index);
                            const updatedMinistry = { ...ministry, goals: newGoals };
                            handleSave(updatedMinistry);
                          }}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    ))}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        const updatedMinistry = {
                          ...ministry,
                          goals: [...ministry.goals, ""]
                        };
                        handleSave(updatedMinistry);
                      }}
                    >
                      <Plus size={16} className="mr-2" />
                      Add Goal
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Activities</label>
                  {ministry.activities.map((activity, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Input
                        value={activity}
                        onChange={(e) => {
                          const newActivities = [...ministry.activities];
                          newActivities[index] = e.target.value;
                          const updatedMinistry = { ...ministry, activities: newActivities };
                          handleSave(updatedMinistry);
                        }}
                      />
                      <Button 
                        variant="destructive" 
                        size="icon"
                        onClick={() => {
                          const newActivities = ministry.activities.filter((_, i) => i !== index);
                          const updatedMinistry = { ...ministry, activities: newActivities };
                          handleSave(updatedMinistry);
                        }}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      const updatedMinistry = {
                        ...ministry,
                        activities: [...ministry.activities, ""]
                      };
                      handleSave(updatedMinistry);
                    }}
                  >
                    <Plus size={16} className="mr-2" />
                    Add Activity
                  </Button>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Images</label>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Ministry Image</p>
                      <ImageUploader
                        onImageSelected={(file, previewUrl) => {
                          const updatedMinistry = { ...ministry, imageUrl: previewUrl };
                          handleSave(updatedMinistry);
                        }}
                      />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Banner Image</p>
                      <ImageUploader
                        onImageSelected={(file, previewUrl) => {
                          const updatedMinistry = { ...ministry, bannerUrl: previewUrl };
                          handleSave(updatedMinistry);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdminMinistryDetails;
