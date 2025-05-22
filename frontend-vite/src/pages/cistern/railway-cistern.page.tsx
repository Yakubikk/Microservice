import { CisternTable } from "@/components";
import React, { useState } from "react";
import { createRailwayCistern, deleteRailwayCistern, updateRailwayCistern, useGetRailwayCisternsQuery } from "@/api";
import { Dialog, DialogContent, DialogTitle } from "@/components/data-display/dialog/dialog.component";
import type { RailwayCistern, RailwayCisternInput } from "@/types";
import CisternForm from "@/components/forms/cistern/cistern.form";

const RailwayCisternPage: React.FC = () => {
  const { data: cisterns, isLoading } = useGetRailwayCisternsQuery();
  const [open, setOpen] = useState(false);
  const [selectedCistern, setSelectedCistern] = useState<RailwayCistern | undefined>(undefined);
  const [isEdit, setIsEdit] = useState(false);

  const hamdleSubmit = async (cistern: RailwayCisternInput) => {
    if (isEdit && selectedCistern) await updateRailwayCistern(selectedCistern.id, cistern);
    else await createRailwayCistern(cistern);
  };

  const handleEdit = async (cistern: RailwayCistern) => {
    setIsEdit(true);
    setSelectedCistern(cistern);
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteRailwayCistern(id);
  };

  const handleClose = () => {
    setOpen(false);
    setIsEdit(false);
    setSelectedCistern(undefined);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Вагоны-цистерны</h1>
        <button onClick={() => setOpen(true)} className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">
          Добавить цистерну
        </button>
      </div>
      <CisternTable
        cisterns={cisterns || []}
        isLoading={isLoading}
        className="mb-4 w-full"
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <Dialog open={open} onOpenChange={() => setOpen(false)}>
        <DialogTitle className="text-lg font-bold">
          {isEdit ? "Редактировать цистерну" : "Добавить цистерну"}
          <button onClick={handleClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
            <span>Закрыть</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </DialogTitle>
        <DialogContent className="w-screen">
          <CisternForm
            onSubmit={hamdleSubmit}
            manufacturers={[]}
            wagonTypes={[]}
            initialData={selectedCistern}
            isEdit={isEdit}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export { RailwayCisternPage };
export default RailwayCisternPage;
