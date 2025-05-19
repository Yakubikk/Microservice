import React from "react";
import { IconX } from "@tabler/icons-react";
import { ManufacturerForm } from "@/components/blocks";

interface ManufacturerModalProps {
    action: "create" | "update";
    manufacturerId?: string;
    onSuccess: () => void;
    onClose: () => void;
}

const ManufacturerModal: React.FC<ManufacturerModalProps> = ({
    action,
    manufacturerId,
    onClose,
    onSuccess,
}) => {
    return (
        <div className="w-[calc(100vw-12rem)] max-w-6xl min-w-[596px] h-[calc(100vh-10rem)] max-h-[50rem] flex flex-col">
            <div className="w-full h-fit flex justify-between items-center pl-4 pr-2 py-1 border-b border-gray-300">
                <div></div>
                <span className="p-2 rounded-full" onClick={onClose}>
                    <IconX />
                </span>
            </div>
            <ManufacturerForm
                action={action}
                manufacturerId={manufacturerId}
                onSuccess={onSuccess}
            />
        </div>
    );
};

export { ManufacturerModal };
export default ManufacturerModal;
