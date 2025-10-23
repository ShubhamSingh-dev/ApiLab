"use server";

import db from "@/lib/db";
import { currentUser } from "@/modules/authentication/actions";
import { Prisma, REST_METHOD } from "@prisma/client";
import axios, { AxiosRequestConfig } from "axios";

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
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const existingRequest = await db.request.findFirst({
    where: {
      id: requestId,
      collection: {
        workspace: {
          OR: [
            { ownerId: user.id },
            { members: { some: { userId: user.id } } },
          ],
        },
      },
    },
    select: { id: true },
  });

  if (!existingRequest) {
    throw new Error("Request not found or access denied.");
  }

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

export async function sendRequest(req: {
  method: string;
  url: string;
  headers?: Record<string, string>;
  params?: Record<string, string>;
  body?: any;
}) {
  const config: AxiosRequestConfig = {
    method: req.method,
    url: req.url,
    headers: req.headers,
    params: req.params,
    data: req.body,
    validateStatus: () => true, // ✅ capture errors too
  };

  const start = performance.now();
  try {
    const res = await axios(config);
    const end = performance.now();

    const duration = end - start;
    const size =
      res.headers["content-length"] ||
      new TextEncoder().encode(JSON.stringify(res.data)).length;

    console.log(res.data);

    return {
      status: res.status,
      statusText: res.statusText,
      headers: Object.fromEntries(Object.entries(res.headers)),
      data: res.data,
      duration: Math.round(duration),
      size,
    };
  } catch (error: any) {
    const end = performance.now();
    return {
      error: error.message,
      duration: Math.round(end - start),
    };
  }
}

export async function run(requestId: string) {
  const user = await currentUser();

  if (!user) {
    throw new Error("Unauthorized access to run request");
  }

  try {
    const request = await db.request.findFirst({
      where: {
        id: requestId,
        collection: {
          workspace: {
            OR: [
              { ownerId: user.id },
              { members: { some: { userId: user.id } } },
            ],
          },
        },
      },
      // Select the necessary fields to proceed
      select: {
        id: true,
        method: true,
        url: true,
        headers: true,
        parameters: true,
        body: true,
      },
    });

    if (!request) {
      throw new Error("Request not found or access denied.");
    }

    const requestConfig = {
      method: request.method,
      url: request.url,
      headers: (request.headers as Record<string, string>) || undefined,
      params: (request.parameters as Record<string, any>) || undefined,
      body: request.body || undefined,
    };

    const result = await sendRequest(requestConfig);

    const requestRun = await db.requestRun.create({
      data: {
        requestId: request.id,
        status: result.status || 0,
        statusText: result.statusText || (result.error ? "Error" : null),
        headers: result.headers || "",
        body: result.data
          ? typeof result.data === "string"
            ? result.data
            : JSON.stringify(result.data)
          : Prisma.JsonNull,
        durationMs: result.duration || 0,
      },
    });

    if (result.data && !result.error) {
      await db.request.update({
        where: { id: request.id },
        data: {
          response: result.data,
          updatedAt: new Date(),
        },
      });
    }

    return {
      success: true,
      requestRun,
      result,
    };
  } catch (error: any) {
    try {
      const failedRun = await db.requestRun.create({
        data: {
          requestId,
          status: 0,
          statusText: "Failed",
          headers: "",
          body: error.message,
          durationMs: 0,
        },
      });

      return {
        success: false,
        error: error.message,
        requestRun: failedRun,
      };
    } catch (dbError) {
      return {
        success: false,
        error: `Request failed: ${error.message}. DB save failed: ${
          (dbError as Error).message
        }`,
      };
    }
  }
}

export async function runDirect(requestData: {
  id: string;
  method: string;
  url: string;
  headers?: Record<string, string>;
  parameters?: Record<string, any>;
  body?: any;
}) {
  try {
    const requestConfig = {
      method: requestData.method,
      url: requestData.url,
      headers: requestData.headers,
      params: requestData.parameters,
      body: requestData.body,
    };

    const result = await sendRequest(requestConfig);

    const requestRun = await db.requestRun.create({
      data: {
        requestId: requestData.id,
        status: result.status || 0,
        statusText: result.statusText || (result.error ? "Error" : null),
        headers: result.headers || "",
        body: result.data
          ? typeof result.data === "string"
            ? result.data
            : JSON.stringify(result.data)
          : Prisma.JsonNull,
        durationMs: result.duration || 0,
      },
    });

    // Update request with latest response if successful
    if (result.data && !result.error) {
      await db.request.update({
        where: { id: requestData.id },
        data: {
          response: result.data,
          updatedAt: new Date(),
        },
      });
    }

    return {
      success: true,
      requestRun,
      result,
    };
  } catch (error: any) {
    const failedRun = await db.requestRun.create({
      data: {
        requestId: requestData.id,
        status: 0,
        statusText: "Failed",
        headers: "",
        body: error.message,
        durationMs: 0,
      },
    });

    return {
      success: false,
      error: error.message,
      requestRun: failedRun,
    };
  }
}
