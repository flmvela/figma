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

  const selectedConcept = mockParentConcepts.find(concept => 
    concept.title === value || concept.id === value
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full h-12 justify-between"
        >
          {selectedConcept ? selectedConcept.title : "Search and select parent concept..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Search concepts..." />
          <CommandList>
            <CommandEmpty>No concepts found.</CommandEmpty>
            <CommandGroup>
              {mockParentConcepts.map((concept) => (
                <CommandItem
                  key={concept.id}
                  value={concept.title}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue);
                    setOpen(false);
                  }}
                  className={cn(
                    concept.isRoot && "bg-orange-400 text-white data-[selected=true]:bg-orange-500 hover:bg-orange-500"
                  )}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedConcept?.title === concept.title ? "opacity-100" : "opacity-0",
                      concept.isRoot && "text-white"
                    )}
                  />
                  <div className="flex-1">
                    <div className={cn(
                      concept.isRoot && "text-white"
                    )}>
                      {concept.title}
                    </div>
                    {concept.description && concept.description !== "No description" && (
                      <div className={cn(
                        "text-sm mt-0.5",
                        concept.isRoot ? "text-orange-100" : "text-muted-foreground"
                      )}>
                        {concept.description}
                      </div>
                    )}
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