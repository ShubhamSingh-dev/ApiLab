"use client";

import { Button } from "@/components/ui/button";
import { Hint } from "@/components/ui/hint";
import { Loader, Plus, User } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const Workspace = () => {
  return (
    <>
      <Hint label="Change Workspace">
        <Button className="border border-indigo-400 bg-indigo-400/10 hover:bg-indigo-400/20 text-indigo-400 hover:text-indigo-300 flex flex-row items-center space-x-1">
          <User className="size-4 text-indigo-400" />
          <span className="text-sm text-indigo-400 font-semibold">
            Personal Workspace
          </span>
        </Button>
      </Hint>
    </>
  );
};

export default Workspace;
