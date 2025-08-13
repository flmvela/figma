import { useState } from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "./ui/utils";

interface ParentConcept {
  id: string;
  title: string;
  description?: string;
  isRoot?: boolean;
}

interface ParentConceptSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

const mockParentConcepts: ParentConcept[] = [
  { id: "root", title: "No parent (Root level)", description: "Move to top level", isRoot: true },
  { id: "music-education", title: "Music Education", description: "No description" },
  { id: "rhythm", title: "II. Rhythm", description: "No description" },
  { id: "improvisation", title: "III. Improvisation", description: "No description" },
  { id: "ear-training", title: "IV. Ear Training", description: "No description" },
  { id: "re-harmonization", title: "V. Re-harmonization", description: "No description" },
  { id: "advanced-theory", title: "Advanced Music Theory", description: "No description" },
  { id: "fundamentals", title: "Music Fundamentals", description: "No description" },
  { id: "performance", title: "Performance Studies", description: "No description" },
  { id: "composition", title: "Music Composition", description: "No description" },
  { id: "history", title: "Music History", description: "No description" }
];

export function ParentConceptSelector({ value, onValueChange }: ParentConceptSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const selectedConcept = mockParentConcepts.find(concept => 
    concept.title === value || concept.id === value
  );

  const filteredConcepts = mockParentConcepts.filter(concept =>
    concept.title.toLowerCase().includes(searchValue.toLowerCase()) ||
    concept.description?.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-10 bg-input-background border-input"
        >
          {selectedConcept ? selectedConcept.title : "Select parent concept..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput 
            placeholder="Search parent concepts..." 
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList>
            <CommandEmpty>No concepts found.</CommandEmpty>
            <CommandGroup>
              {filteredConcepts.map((concept) => (
                <CommandItem
                  key={concept.id}
                  value={concept.id}
                  onSelect={() => {
                    onValueChange(concept.title);
                    setOpen(false);
                    setSearchValue("");
                  }}
                  className={cn(
                    "flex flex-col items-start p-3 cursor-pointer",
                    concept.isRoot && "bg-orange-400 text-white data-[selected=true]:bg-orange-500 hover:bg-orange-500"
                  )}
                >
                  <div className="flex items-center w-full">
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedConcept?.id === concept.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex-1">
                      <div className={cn(
                        "font-medium",
                        concept.isRoot && "text-white"
                      )}>
                        {concept.title}
                      </div>
                      {concept.description && (
                        <div className={cn(
                          "text-sm mt-0.5",
                          concept.isRoot ? "text-orange-100" : "text-muted-foreground"
                        )}>
                          {concept.description}
                        </div>
                      )}
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}