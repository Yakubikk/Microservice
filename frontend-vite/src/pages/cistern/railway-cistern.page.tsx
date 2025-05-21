import { CisternTable } from '@/components';
import React from 'react';
import { useGetRailwayCisternsQuery } from '@/api';
import { Dialog, DialogContent, DialogTitle } from '@/components/data-display/dialog/dialog.component';
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import CisternForm from '@/components/forms/cistern/cistern.form';
import type { RailwayCistern } from '@/types';

const RailwayCisternPage: React.FC = () => {
    const { data: cisterns, isLoading } = useGetRailwayCisternsQuery();
    const [open, setOpen] = React.useState(false);
    const [selectedCistern, setSelectedCistern] = React.useState<RailwayCistern | undefined>(undefined);
    const [isEdit, setIsEdit] = React.useState(false);

    const hamdleSubmit = async () => {
        // Здесь вы можете обработать данные формы
    };
    const handleEdit = async (cistern: RailwayCistern) => {
        // Обработка редактирования цистерны
        setIsEdit(true);
        setSelectedCistern(cistern);
        setOpen(true);
    };
    const handleDelete = async (id: string) => {
        // Обработка удаления цистерны
    };
    return (
        <div className="p-4">
            <div className='flex justify-between items-center mb-4'>
                <h1 className="text-2xl font-bold">Вагоны-цистерны</h1>
                <button
                    onClick={() => setOpen(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
                >
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
            <Dialog
                open={open}
                onOpenChange={() => setOpen(false)}
            >
                <VisuallyHidden>
                    <DialogTitle />
                </VisuallyHidden>
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
}

export { RailwayCisternPage };
export default RailwayCisternPage;
