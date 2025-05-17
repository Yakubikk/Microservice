"use client";

import { deleteManufacturer } from "@/lib/actions";
import React from "react";
import toast from "react-hot-toast";

interface DeleteButtonProps {
    manufacturerId: string;
    onSuccess: () => void;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ manufacturerId, onSuccess }) => {
    const handleDelete = async (id: string) => {
        const result = await deleteManufacturer(id);
        if (result) {
            if (result.errors) {
                console.error(result.errors.general[0]);
                toast.error(result.errors.general[0]);
                return;
            }
            if (result.success) {
                console.log("Производитель успешно удалён");
                onSuccess();
                toast.success("Производитель успешно удалён");
            }
        } else {
            console.error("Ошибка при удалении производителя");
            toast.error("Ошибка при удалении производителя");
        }
    };

    return (
        <div>
            <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={() => handleDelete(manufacturerId)}
            >
                Удалить
            </button>
        </div>
    );
};

export { DeleteButton };
export default DeleteButton;
