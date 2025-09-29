"use server";

import db from "@/lib/db";
import { currentUser } from "@/modules/authentication/actions";
import { MEMBER_ROLE } from "@prisma/client";

export const initializeWorkspace = async () => {
  const user = await currentUser();

  if (!user) {
    return {
      success: false,
      error: "User not found",
    };
  }

  try {
    const workspace = await db.workspace.upsert({
      where: {
        name_ownerId: {
          ownerId: user.id,
          name: "Personal Workspace",
        },
      },
      update: {},
      create: {
        name: "Personal Workspace",
        description: "Default workspace for personal use",
        ownerId: user.id,
        members: {
          create: {
            role: MEMBER_ROLE.ADMIN,
            userId: user.id,
          },
        },
      },
      include: {
        members: true,
      },
    });

    return {
      success: true,
      workspace,
    };
  } catch (error) {
    console.error("Error initializing workspace:", error);
    return {
      success: false,
      error: "Failed to initialize workspace",
    };
  }
};

export async function getWorkspaces() {
  const user = await currentUser();

  if (!user) {
    throw new Error("User Unauthorized");
  }

  const workspace = await db.workspace.findMany({
    where: {
      OR: [
        {
          ownerId: user.id,
        },
        {
          members: {
            some: {
              userId: user.id,
            },
          },
        },
      ],
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return workspace;
}

export async function createWorkspace(name: string) {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const workspace = await db.workspace.create({
    data: {
      name,
      ownerId: user.id,
      members: {
        create: {
          userId: user.id,
          role: "ADMIN",
        },
      },
    },
  });

  return workspace;
}

export const getWorkspaceById = async (id: string) => {
  const workspace = await db.workspace.findUnique({
    where: { id },
    include: {
      members: true,
    },
  });
  return workspace;
};
