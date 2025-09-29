import { currentUser } from "@/modules/authentication/actions";
import UserButton from "@/modules/authentication/components/user-button";
import React from "react";

const page = async () => {
  const user = await currentUser();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen"></div>
  );
};

export default page;
