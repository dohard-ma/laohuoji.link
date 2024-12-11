"use client";

import { Tag } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  availableTags: Tag[];
  selectedTags: Tag[];
  onSelect: (tag: Tag) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  placeholder?: string;
}

export default function TagSelector({
  availableTags,
  selectedTags,
  onSelect,
  open,
  onOpenChange,
  placeholder = "选择标签...",
}: Props) {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command style={{ background: "white" }}>
          <CommandInput placeholder="搜索标签..." />
          <CommandList>
            <CommandEmpty>未找到相关标签</CommandEmpty>
            <CommandGroup>
              {availableTags.map((tag) => (
                <CommandItem
                  key={tag.id}
                  value={tag.name}
                  style={{ cursor: "pointer" }}
                  onSelect={(currentValue) => {
                    const selectedTag = availableTags.find((t) => t.name === currentValue);
                    if (selectedTag && !selectedTags.some((t) => t.id === selectedTag.id)) {
                      onSelect(selectedTag);
                    }
                    onOpenChange(false);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Check
                      className={cn(
                        "h-4 w-4",
                        selectedTags.some((t) => t.id === tag.id) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span>{tag.name}</span>
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
