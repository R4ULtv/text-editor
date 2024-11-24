"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

export const CheckItem = ({ number }) => {
  const [checked, setChecked] = useState(false);

  return (
    <Checkbox
      checked={checked}
      onCheckedChange={() => setChecked(!checked)}
      placeholder={number}
      className="mt-1 rounded-full bg-zinc-200 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 data-[state=checked]:bg-gemini data-[state=checked]:text-blue-50 data-[state=checked]:border-transparent"
    />
  );
};
