"use client";

import { Unplug } from "lucide-react";
import React from "react";
import UserButton from "@/modules/authentication/components/user-button";
import { UserProps } from "../types";
import SearchBar from "./search-bar";
import InviteMember from "./invite-member";
import Workspace from "./workspace";

interface Props {
  user: UserProps;
}

const Header = ({ user }: Props) => {
  return (
    <header className="grid grid-cols-5 grid-rows-1 overflow-x-auto gap-2 overflow-hidden p-2 border">
      <div className="col-span-2 flex items-center justify-between space-x-2 hover:cursor-pointer hover:opacity-80 ml-4">
        <Unplug size={28} className="text-indigo-400" />
      </div>
      <div className="col-span-1 flex items-center justify-between space-x-2">
        <div
          className="border-animation relative p-[1px] rounded flex-1 self-stretch overflow-hidden flex items-center justify-center"
          aria-hidden="true"
        >
          <SearchBar />
        </div>
      </div>
      <div className="col-span-2 flex items-center justify-end space-x-2 hover:cursor-pointer hover:opacity-80">
        <InviteMember />
        <Workspace />
        <UserButton user={user} size="sm" />
      </div>
    </header>
  );
};

export default Header;
