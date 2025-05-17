"use client";

import React, { useActionState, useEffect, useState } from "react";
import { FormProvider, SubmitButton, TextField } from "@/components";
import {
    createManufacturer,
    getManufacturerById,
    updateManufacturer,
} from "@/lib/actions";
import toast from "react-hot-toast";
import { Manufacturer } from "@prisma/client";

interface ManufacturerFormProps {
    action: "create" | "update";
    manufacturerId?: string;
    onSuccess: () => void;
}

const ManufacturerForm: React.FC<ManufacturerFormProps> = ({
    action,
    manufacturerId,
    onSuccess,
}) => {
    const [state, formAction] = useActionState(
        action === "create" ? createManufacturer : updateManufacturer,
        null
    );

    const [manufacturer, setManufacturer] = useState<Manufacturer | null>(null);
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(false);

    const errors = state?.errors as Record<string, string[]> | undefined;
    const errorMessage = errors?.general?.[0] || errors?.name?.[0] || "";

    useEffect(() => {
        if (state?.errors) {
            setDisabled(true);
            toast.error(errorMessage);
        }
    }, [errorMessage, state?.errors]);

    useEffect(() => {
        if (action === "update" && manufacturerId) {
            setLoading(true);
            const fetchManufacturer = async () => {
                const result = await getManufacturerById(manufacturerId);
                if (result) {
                    if ("errors" in result) {
                        console.error(result.errors.general[0]);
                        toast.error(result.errors.general[0]);
                        setLoading(false);
                        return;
                    } else {
                        setManufacturer(result);
                        setName(result.name);
                        setLoading(false);
                    }
                } else {
                    toast.error("Ошибка при загрузке производителя");
                }
            };

            fetchManufacturer();
        }
    }, [action, errorMessage, manufacturerId]);

    useEffect(() => {
        if (state?.success) {
            switch (action) {
                case "create":
                    toast.success("Производитель успешно создан");
                    setName("");
                    onSuccess();
                    break;
                case "update":
                    toast.success("Производитель успешно обновлён");
                    onSuccess();
                    break;
                default:
                    toast.error("Неизвестное действие");
            }
        }
        return () => {
            setManufacturer(null);
            setName("");
        };
    }, [action, onSuccess, state?.success]);

    return (
        <FormProvider state={state}>
            <form
                autoComplete="off"
                action={formAction}
                className="flex max-w-[600px] flex-col gap-4"
            >
                {action === "update" && manufacturer?.id && (
                    <input type="hidden" name="id" value={manufacturer.id} />
                )}

                <TextField
                    name="name"
                    placeholder={loading ? "Загрузка..." : "Название"}
                    disabled={loading || disabled}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <SubmitButton
                    pendingText={
                        action === "create" ? "Создание..." : "Обновление..."
                    }
                    disabled={loading || disabled}
                >
                    {action === "create"
                        ? "Создать производителя"
                        : "Обновить производителя"}
                </SubmitButton>
            </form>
        </FormProvider>
    );
};

export { ManufacturerForm };
export default ManufacturerForm;
