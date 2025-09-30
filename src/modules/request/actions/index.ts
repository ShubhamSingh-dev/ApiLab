"use server";

import db from "@/lib/db";
import { REST_METHOD } from "@prisma/client";

export type Request = {
  name: string;
  method: REST_METHOD;
  url: string;

  parameters?: string;
  headers?: string;
  body?: string;
};

export const addRequestToCollection = async (
  collectionId: string,
  value: Request
) => {
  const request = await db.request.create({
    data: {
      collectionId,
      name: value.name,
      method: value.method,
      url: value.url,
      parameters: value.parameters,
      headers: value.headers,
      body: value.body,
    },
  });

  return request;
};

export const saveRequest = async (requestId: string, value: Request) => {
  const request = await db.request.update({
    where: { id: requestId },
    data: {
      name: value.name,
      method: value.method,
      url: value.url,
      parameters: value.parameters,
      headers: value.headers,
      body: value.body,
    },
  });
  return request;
};

export const getAllRequestFromCollection = async (collectionId: string) => {
  const requests = await db.request.findMany({
    where: {
      collectionId,
    },
  });
  return requests;
};
