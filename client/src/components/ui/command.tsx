"use client";

import * as React from "react";
import { DialogProps } from "@radix-ui/react-dialog";
import { 
  Command as CommandPrimitive, 
  CommandInput as PrimitiveCommandInput, // Renaming imported CommandInput
  CommandList as PrimitiveCommandList,
  CommandItem as PrimitiveCommandItem,
  CommandGroup as PrimitiveCommandGroup,
  CommandSeparator as PrimitiveCommandSeparator,
  CommandEmpty as PrimitiveCommandEmpty,
} from "cmdk";
import { Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";

// Refactor Command component
const Command = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof CommandPrimitive>>
  (
  ({ className, ...props }, ref) => (
    <CommandPrimitive
      ref={ref}
      className={cn(
        "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
        className
      )}
      {...props}
    />
  )
);
Command.displayName = CommandPrimitive.displayName;

// Refactor CommandDialog component
const CommandDialog: React.FC<DialogProps & { children: React.ReactNode }> = ({ children, ...props }) => {
  return (
    <Dialog {...props}>
      <DialogContent className="overflow-hidden p-0">
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
};

// Refactor CommandInput component (local definition)
const CommandInput = React.forwardRef<HTMLInputElement, React.ComponentPropsWithoutRef<typeof PrimitiveCommandInput>>(
  ({ className, ...props }, ref) => (
    <div className="flex items-center border-b px-3">
      <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
      <PrimitiveCommandInput // Use the renamed version here
        ref={ref}
        className={cn(
          "flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    </div>
  )
);
CommandInput.displayName = PrimitiveCommandInput.displayName;

// Refactor CommandList component
const CommandList = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof PrimitiveCommandList>>(
  ({ className, ...props }, ref) => (
    <PrimitiveCommandList
      ref={ref}
      className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className)}
      {...props}
    />
  )
);
CommandList.displayName = PrimitiveCommandList.displayName;

// Refactor CommandEmpty component
const CommandEmpty = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof PrimitiveCommandEmpty>>(
  (props, ref) => (
    <PrimitiveCommandEmpty
      ref={ref}
      className="py-6 text-center text-sm"
      {...props}
    />
  )
);
CommandEmpty.displayName = PrimitiveCommandEmpty.displayName;

// Refactor CommandGroup component
const CommandGroup = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof PrimitiveCommandGroup>>(
  ({ className, ...props }, ref) => (
    <PrimitiveCommandGroup
      ref={ref}
      className={cn(
        "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
        className
      )}
      {...props}
    />
  )
);
CommandGroup.displayName = PrimitiveCommandGroup.displayName;

// Refactor CommandSeparator component
const CommandSeparator = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof PrimitiveCommandSeparator>>(
  ({ className, ...props }, ref) => (
    <PrimitiveCommandSeparator
      ref={ref}
      className={cn("-mx-1 h-px bg-border", className)}
      {...props}
    />
  )
);
CommandSeparator.displayName = PrimitiveCommandSeparator.displayName;

// Refactor CommandItem component
const CommandItem = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof PrimitiveCommandItem>>(
  ({ className, ...props }, ref) => (
    <PrimitiveCommandItem
      ref={ref}
      className={cn(
        "relative flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        className
      )}
      {...props}
    />
  )
);
CommandItem.displayName = PrimitiveCommandItem.displayName;

// Refactor CommandShortcut component
const CommandShortcut: React.FC<React.HTMLAttributes<HTMLSpanElement>> = ({ className, ...props }) => {
  return (
    <span
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className
      )}
      {...props}
    />
  );
};
CommandShortcut.displayName = "CommandShortcut";

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};
