"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components";
import React, { useState } from "react";
import ManufacturerModal from "../manufacturer.modal";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface CreateButtonProps {
    onSuccess: () => void;
}

const CreateButton: React.FC<CreateButtonProps> = ({onSuccess}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => setIsOpen(true)}
            >
                Создать
            </button>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <VisuallyHidden>
                    <DialogTitle />
                </VisuallyHidden>
                <DialogContent aria-describedby={undefined}>
                    <ManufacturerModal
                        action="create"
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

export { CreateButton };
export default CreateButton;
