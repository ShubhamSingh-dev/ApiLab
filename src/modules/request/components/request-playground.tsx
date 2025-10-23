import React, { useState } from "react";
import { useRequestPlaygroundStore } from "../store/useRequestStore";
import { useSaveRequest } from "../hooks/request";
import { Unplug } from "lucide-react";
import TabBar from "./tab-bar";
import { useHotkeys } from "react-hotkeys-hook";
import { toast } from "sonner";
import RequestEditor from "./request-editor";
import { REST_METHOD } from "@prisma/client";
import SaveRequestToCollectionModal from "@/modules/collections/components/add-request-modal";
const PlaygroundPage = () => {
  const { tabs, activeTabId, addTab } = useRequestPlaygroundStore();

  const activeTab = tabs.find((tab) => tab.id === activeTabId);
  const { mutateAsync, isPending } = useSaveRequest(activeTab?.requestId || "");
  const [showSaveModal, setShowSaveModal] = useState(false);

  const getCurrentRequestData = () => {
    if (!activeTab) {
      return {
        name: "Untitled Request",
        method: REST_METHOD.GET as REST_METHOD,
        url: "https://api.example.com/endpoint",
      };
    }

    return {
      name: activeTab.title,
      method: activeTab.method as REST_METHOD,
      url: activeTab.url,
    };
  };

  useHotkeys(
    "ctrl+s, meta+s",
    async (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!activeTab) {
        toast.error("No active request to save");
        return;
      }

      if (activeTab.requestId) {
        try {
          await mutateAsync({
            name: activeTab.title || "Untitled Request",
            method: activeTab.method as REST_METHOD,
            url: activeTab.url || "https://api.example.com/endpoint",
            headers: activeTab.headers,
            body: activeTab.body,
            parameters: activeTab.parameters,
          });

          toast.success("Request saved successfully");
        } catch (error: any) {
          const message =
            error instanceof Error ? error.message : "Unknown error";
          toast.error("Failed to save request: " + message);
        }
      } else {
        setShowSaveModal(true);
      }
    },
    {
      preventDefault: true,
      enableOnFormTags: true,
    },
    [activeTab]
  );

  useHotkeys(
    "ctrl+g, meta+shift+g",
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      addTab();
      toast.success("New request created");
    },
    {
      preventDefault: true,
      enableOnFormTags: true,
    }
  );

  if (!activeTab) {
    return (
      <div className="flex space-y-4 flex-col h-full items-center justify-center">
        <div className="flex flex-col justify-center items-center h-40 w-40 border rounded-full bg-zinc-900">
          <Unplug size={80} className="text-indigo-400" />
        </div>

        <div className="bg-zinc-900 p-4 rounded-lg space-y-2">
          <div className="flex justify-between items-center gap-8">
            <kbd className="px-2 py-1 bg-zinc-800 text-indigo-400 text-sm rounded border">
              Ctrl+g
            </kbd>
            <span className="text-zinc-400 font-semibold">New Request</span>
          </div>
          <div className="flex justify-between items-center gap-8">
            <kbd className="px-2 py-1 bg-zinc-800 text-indigo-400 text-sm rounded border">
              Ctrl+S
            </kbd>
            <span className="text-zinc-400 font-semibold">Save Request</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <TabBar />
      <div className="flex-1 overflow-auto">
        <RequestEditor />
      </div>
      <SaveRequestToCollectionModal
        isModalOpen={showSaveModal}
        setIsModalOpen={setShowSaveModal}
        requestData={getCurrentRequestData()}
        initialName={getCurrentRequestData().name}
      />
    </div>
  );
};

export default PlaygroundPage;
