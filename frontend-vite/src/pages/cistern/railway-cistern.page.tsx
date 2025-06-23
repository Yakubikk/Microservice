import { CisternTable } from "@/components";
import React, { useEffect, useState } from "react";
import {
  createRailwayCistern,
  deleteRailwayCistern,
  updateRailwayCistern,
  useGetRailwayCisternsQuery,
  exportRailwayCisterns,
  importRailwayCisterns,
} from "@/api";
import { Dialog, DialogContent, DialogTitle } from "@/components/data-display/dialog/dialog.component";
import { CsvOperations } from "@/components/data-display/csv-operations";
import type { RailwayCistern, RailwayCisternInput, WagonType } from "@/types";
import CisternForm from "@/components/forms/cistern/cistern.form";

const RailwayCisternPage: React.FC = () => {
  const { data: cisterns, isLoading } = useGetRailwayCisternsQuery();
  const [open, setOpen] = useState(false);
  const [selectedCistern, setSelectedCistern] = useState<RailwayCistern | undefined>(undefined);
  const [isEdit, setIsEdit] = useState(false);
  const [wagonTypes, setWagonTypes] = useState<WagonType[]>([]);

  useEffect(() => {
    const fetchWagonTypes = async () => {
      const response: WagonType[] = [
        { id: '1', name: 'Тип 1' },
        { id: '2', name: 'Тип 2' },
        { id: '3', name: 'Тип 3' },
      ];
      setWagonTypes(response);
    };

    fetchWagonTypes();
  }, []);

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

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Вагоны-цистерны</h1>
        <button onClick={() => setOpen(true)} className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">
          Добавить цистерну
        </button>
      </div>

      {/* CSV Operations */}
      <div className="mb-6">
        <CsvOperations
          onImport={importRailwayCisterns}
          onExport={exportRailwayCisterns}
          title="Операции с CSV"
          importText="Импорт цистерн"
          exportText="Экспорт цистерн"
        />
      </div>

      <CisternTable
        cisterns={cisterns || []}
        isLoading={isLoading}
        className="mb-4 w-full"
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <Dialog open={open} onOpenChange={() => setOpen(false)}>
        <DialogTitle />
        <DialogContent className="w-screen" aria-describedby={undefined}>
          <CisternForm
            onSubmit={hamdleSubmit}
            manufacturers={[]}
            wagonTypes={wagonTypes}
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
