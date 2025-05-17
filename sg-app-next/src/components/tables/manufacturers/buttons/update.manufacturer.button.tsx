"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components";
import React, { useState } from "react";
import ManufacturerModal from "../manufacturer.modal";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface UpdateButtonProps {
    manufacturerId: string;
    onSuccess: () => void;
}

const UpdateButton: React.FC<UpdateButtonProps> = ({
    manufacturerId,
    onSuccess,
}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => setIsOpen(true)}
            >
                Обновить
            </button>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <VisuallyHidden>
                    <DialogTitle />
                </VisuallyHidden>
                <DialogContent aria-describedby={undefined}>
                    <ManufacturerModal
                        action="update"
                        manufacturerId={manufacturerId}
                        onClose={() => setIsOpen(false)}
                        onSuccess={() => {
                            onSuccess();
                            setIsOpen(false);
                        }}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
};

export { UpdateButton };
export default UpdateButton;
