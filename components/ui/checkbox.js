"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "@heroicons/react/16/solid";

import { cn } from "@/utils/cn";

const Checkbox = React.forwardRef(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "group size-6 shrink-0 rounded-sm border outline-none disabled:cursor-not-allowed disabled:opacity-50 translate-colors duration-75 ease-out",
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <CheckIcon className="size-4" />
    </CheckboxPrimitive.Indicator>
    <div className="text-sm group-data-[state=checked]:hidden">
      {props.placeholder}
    </div>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
