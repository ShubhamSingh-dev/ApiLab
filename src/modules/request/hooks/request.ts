import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addRequestToCollection,
  getAllRequestFromCollection,
  saveRequest,
  type Request,
} from "../actions";

export function useAddRequestToCollection(collectionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (value: Request) =>
      addRequestToCollection(collectionId, value),
    onSuccess: async (data) => {
      queryClient.invalidateQueries({
        queryKey: ["requests", collectionId],
      });
      console.log(data);
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
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (value: Request) => saveRequest(requestId, value),
    onSuccess: async (data) => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      console.log(data);
    },
  });
}
