import { create } from "zustand";

type workspace = {
  id: string;
  name: string;
};

interface WorkspaceState {
  selectedWorkspace: workspace | null;
  setSelectedWorkspace: (workspace: workspace) => void;
}

export const useWorkspaceStore = create<WorkspaceState>()((set) => ({
  selectedWorkspace: null,
  setSelectedWorkspace: (workspace) =>
    set(() => ({ selectedWorkspace: workspace })),
}));
