
import { Search, Filter, Calendar, User2, Tag } from 'lucide-react';
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface SermonFilterProps {
  searchTerm: string;
  selectedSpeaker: string;
  selectedTopic: string;
  selectedDate: string;
  speakers: string[];
  topics: string[];
  dates: string[];
  onSearchChange: (value: string) => void;
  onSpeakerChange: (value: string) => void;
  onTopicChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onReset: () => void;
}

const SermonFilter = ({
  searchTerm,
  selectedSpeaker,
  selectedTopic,
  selectedDate,
  speakers,
  topics,
  dates,
  onSearchChange,
  onSpeakerChange,
  onTopicChange,
  onDateChange,
  onReset,
}: SermonFilterProps) => {
  return (
    <div className="bg-white shadow-lg rounded-xl p-6 mb-8">
      <div className="space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search sermons..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-divine focus:border-transparent transition-all"
          />
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <User2 className="h-4 w-4 text-divine" />
              Speaker
            </label>
            <Select value={selectedSpeaker} onValueChange={onSpeakerChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Speakers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Speakers</SelectItem>
                {speakers.map((speaker) => (
                  <SelectItem key={speaker} value={speaker}>
                    {speaker}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Tag className="h-4 w-4 text-divine" />
              Topic
            </label>
            <Select value={selectedTopic} onValueChange={onTopicChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Topics" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Topics</SelectItem>
                {topics.map((topic) => (
                  <SelectItem key={topic} value={topic}>
                    {topic}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-divine" />
              Date
            </label>
            <Select value={selectedDate} onValueChange={onDateChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Dates" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Dates</SelectItem>
                {dates.map((date) => (
                  <SelectItem key={date} value={date}>
                    {date}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Reset Button */}
        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={onReset}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Reset Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SermonFilter;
