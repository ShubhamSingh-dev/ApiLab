import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCollection,
  deleteCollection,
  editCollection,
  getCollections,
} from "../actions";

export function useCollections(workspaceId: string) {
  return useQuery({
    queryKey: ["collections", workspaceId],
    queryFn: async () => await getCollections(workspaceId),
  });
}

export function useCreateCollection(workspaceId: string, name: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => await createCollection(name, workspaceId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["collections", workspaceId],
      });
    },
  });
}

export function useEditCollection(collectionId: string, name: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => editCollection(collectionId, name),
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ["collections"],
      });
    },
  });
}

export function useDeleteCollection(collectionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => await deleteCollection(collectionId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["collections"] });
    },
  });
}
