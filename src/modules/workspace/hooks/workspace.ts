import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createWorkspace, getWorkspaces, getWorkspaceById } from "../actions";

export function useWorkspace() {
  return useQuery({
    queryKey: ["workspaces"],
    queryFn: async () => await getWorkspaces(),
  });
}

export function useCreateWorkspace() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => await createWorkspace(name),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
  });
}

export function useGetWorkspace(workspaceId: string) {
  return useQuery({
    queryKey: ["workspace", workspaceId],
    queryFn: async () => await getWorkspaceById(workspaceId),
  });
}
