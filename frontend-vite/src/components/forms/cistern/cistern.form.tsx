import { DatePicker, showToast, TextField } from "@/components";
import React, { useEffect } from "react";
import { FormProvider, type SubmitHandler, useForm } from "react-hook-form";
import type { RailwayCistern, RailwayCisternInput } from "@/types/cistern.types";
import type { Manufacturer, Registrar, WagonModel, WagonType } from "@/types/dictionary.types";

interface CisternFormProps {
  onSubmit: (data: RailwayCisternInput) => Promise<void>;
  initialData?: RailwayCistern;
  manufacturers: Manufacturer[];
  wagonTypes: WagonType[];
  wagonModels?: WagonModel[];
  registrars?: Registrar[];
  isEdit?: boolean;
}

const CisternForm: React.FC<CisternFormProps> = ({
  onSubmit,
  initialData,
  manufacturers,
  wagonTypes,
  wagonModels = [],
  registrars = [],
  isEdit = false
}) => {
  const form = useForm<RailwayCisternInput>({
    defaultValues: initialData || {
      number: "",
      manufacturerId: "",
      buildDate: "",
      tareWeight: 0,
      loadCapacity: 0,
      length: 0,
      axleCount: 4,
      volume: 0,
      typeId: "",
      serialNumber: "",
      registrationNumber: "",
      registrationDate: new Date().toISOString().split("T")[0],
    },
  });

  const { handleSubmit, reset } = form;

  // При изменении initialData обновляем форму
  useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
        buildDate: initialData.buildDate.split("T")[0],
        registrationDate: initialData.registrationDate
          ? initialData.registrationDate.split("T")[0]
          : new Date().toISOString().split("T")[0],
        commissioningDate: initialData.commissioningDate ? initialData.commissioningDate.split("T")[0] : undefined,
      });
    }
  }, [initialData, reset]);

  const handleFormSubmit: SubmitHandler<RailwayCisternInput> = async (data) => {
    try {
      await onSubmit(data);
      showToast.success(isEdit ? "Данные обновлены успешно" : "Цистерна создана успешно");
      if (!isEdit) {
        reset(); // Очищаем форму при создании, но не при редактировании
      }
    } catch (error) {
      console.error("Ошибка при сохранении данных:", error);
      showToast.error(isEdit ? "Ошибка при обновлении данных" : "Ошибка при создании цистерны");
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 p-6">
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          <TextField name="number" label="Номер вагона-цистерны" validation={{ required: "Обязательное поле" }} />

          <div className="relative mt-1 mb-8">
            <label className="block text-sm text-gray-600">Производитель</label>
            <select
              {...form.register("manufacturerId", { required: "Обязательное поле" })}
              className="w-full bg-transparent py-2 px-0 focus:outline-none focus:ring-0 border-b border-gray-300"
            >
              <option value="">Выберите производителя</option>
              {manufacturers.map((manufacturer) => (
                <option key={manufacturer.id} value={manufacturer.id}>
                  {manufacturer.name}
                </option>
              ))}
            </select>
            {form.formState.errors.manufacturerId && (
              <p className="mt-1 text-sm text-red-500">{form.formState.errors.manufacturerId.message}</p>
            )}
          </div>

          <DatePicker name="buildDate" label="Дата постройки" validation={{ required: "Обязательное поле" }} />

          <TextField
            name="tareWeight"
            label="Вес тары (т)"
            type="number"
            validation={{
              required: "Обязательное поле",
              min: { value: 0, message: "Значение должно быть положительным" },
            }}
          />

          <TextField
            name="loadCapacity"
            label="Грузоподъемность (т)"
            type="number"
            validation={{
              required: "Обязательное поле",
              min: { value: 0, message: "Значение должно быть положительным" },
            }}
          />

          <TextField
            name="length"
            label="Длина (м)"
            type="number"
            validation={{
              required: "Обязательное поле",
              min: { value: 0, message: "Значение должно быть положительным" },
            }}
          />

          <TextField
            name="axleCount"
            label="Количество осей"
            type="number"
            validation={{
              required: "Обязательное поле",
              min: { value: 0, message: "Значение должно быть положительным" },
            }}
          />

          <TextField
            name="volume"
            label="Объем (м³)"
            type="number"
            validation={{
              required: "Обязательное поле",
              min: { value: 0, message: "Значение должно быть положительным" },
            }}
          />

          <TextField
            name="fillingVolume"
            label="Полезный объем (м³)"
            type="number"
            validation={{
              min: { value: 0, message: "Значение должно быть положительным" },
            }}
          />

          <TextField
            name="initialTareWeight"
            label="Начальный вес тары (т)"
            type="number"
            validation={{
              min: { value: 0, message: "Значение должно быть положительным" },
            }}
          />

          <div className="relative mt-1 mb-8">
            <label className="block text-sm text-gray-600">Тип вагона</label>
            <select
              {...form.register("typeId", { required: "Обязательное поле" })}
              className="w-full bg-transparent py-2 px-0 focus:outline-none focus:ring-0 border-b border-gray-300"
            >
              <option value="">Выберите тип</option>
              {wagonTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
            {form.formState.errors.typeId && (
              <p className="mt-1 text-sm text-red-500">{form.formState.errors.typeId.message}</p>
            )}
          </div>

          <div className="relative mt-1 mb-8">
            <label className="block text-sm text-gray-600">Модель вагона</label>
            <select
              {...form.register("modelId")}
              className="w-full bg-transparent py-2 px-0 focus:outline-none focus:ring-0 border-b border-gray-300"
            >
              <option value="">Выберите модель</option>
              {wagonModels.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
          </div>

          <DatePicker name="commissioningDate" label="Дата ввода в эксплуатацию" />

          <TextField name="serialNumber" label="Серийный номер" validation={{ required: "Обязательное поле" }} />

          <TextField
            name="registrationNumber"
            label="Регистрационный номер"
            validation={{ required: "Обязательное поле" }}
          />

          <DatePicker name="registrationDate" label="Дата регистрации" validation={{ required: "Обязательное поле" }} />

          <div className="relative mt-1 mb-8">
            <label className="block text-sm text-gray-600">Регистратор</label>
            <select
              {...form.register("registrarId")}
              className="w-full bg-transparent py-2 px-0 focus:outline-none focus:ring-0 border-b border-gray-300"
            >
              <option value="">Выберите регистратора</option>
              {registrars.map((registrar) => (
                <option key={registrar.id} value={registrar.id}>
                  {registrar.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* Блок сосуда */}
        <div className="mt-8 border-t pt-4">
          <h3 className="text-lg font-medium">Информация о сосуде</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <TextField name="vesselSerialNumber" label="Серийный номер сосуда" />

            <DatePicker name="vesselBuildDate" placeholder="Дата изготовления сосуда" />
          </div>
        </div>
        <div className="mt-6">
          <TextField name="notes" label="Примечания" type="text" />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {isEdit ? "Обновить данные" : "Создать цистерну"}
          </button>
        </div>
      </form>
    </FormProvider>
  );
};

export default CisternForm;
