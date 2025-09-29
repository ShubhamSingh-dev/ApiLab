"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, Copy, Link as LinkIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Hint } from "@/components/ui/hint";

const InviteMember = () => {
  return (
    <Hint label="Invite Members">
      <Button className="border border-emerald-400 bg-emerald-400/10 hover:bg-emerald-400/20 text-emerald-400 hover:text-emerald-300">
        <UserPlus className="size-4 text-emerald-400" />
      </Button>
    </Hint>
  );
};

export default InviteMember;
