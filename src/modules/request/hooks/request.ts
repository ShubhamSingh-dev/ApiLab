import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addRequestToCollection,
  getAllRequestFromCollection,
  run,
  saveRequest,
  type Request,
} from "../actions";
import { useRequestPlaygroundStore } from "../store/useRequestStore";

export function useAddRequestToCollection(collectionId: string) {
  const queryClient = useQueryClient();
  const { updateTabFromSavedRequest, activeTabId } =
    useRequestPlaygroundStore();
  return useMutation({
    mutationFn: async (value: Request) =>
      addRequestToCollection(collectionId, value),
    onSuccess: async (data) => {
      queryClient.invalidateQueries({
        queryKey: ["requests", collectionId],
      });
      // @ts-ignore
      updateTabFromSavedRequest(activeTabId!, data);
    },
  });
}

export function useGetAllRequestFromCollection(collectionId: string) {
  return useQuery({
    queryKey: ["requests", collectionId],
    queryFn: async () => getAllRequestFromCollection(collectionId),
  });
}

export function useSaveRequest(requestId: string) {
  const { updateTabFromSavedRequest, activeTabId } =
    useRequestPlaygroundStore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (value: Request) => saveRequest(requestId, value),
    onSuccess: async (data) => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      //@ts-ignore
      updateTabFromSavedRequest(activeTabId!, data);
    },
  });
}

export const useRunRequest = (requestId: string) => {
  const queryClient = useQueryClient();
  const { setResponseViewerData } = useRequestPlaygroundStore();

  return useMutation({
    mutationFn: async () => run(requestId),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      // @ts-ignore
      setResponseViewerData(data);
    },
  });
};
