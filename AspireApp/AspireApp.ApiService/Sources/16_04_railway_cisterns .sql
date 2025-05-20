-- 1.1. Заводы-изготовители
CREATE TABLE manufacturers
(
    id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name    VARCHAR(100) NOT NULL,
    country VARCHAR(50)  NOT NULL
);

-- 1.2. Типы вагонов
CREATE TABLE wagon_types
(
    id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL
);

-- 1.3. Регистраторы 
CREATE TABLE registrars
(
    id   SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);
CREATE TABLE wagon_models
(
    model_id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Уникальный ID модели
    name     VARCHAR(100) NOT NULL UNIQUE                -- Название модели (например, "15-1500")
);

-- 2.1. Вагоны-цистерны
CREATE TABLE railway_cisterns
(
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    number              VARCHAR(20)    NOT NULL UNIQUE,
    -- Завод изготовитель (справочник)
    manufacturer_id     UUID           NOT NULL REFERENCES manufacturers (id),
    -- Дата постройки
    build_date          DATE           NOT NULL,
    -- Текущая тара (тн)
    tare_weight         DECIMAL(10, 2) NOT NULL,
    -- Грузоподъемность (тн)
    load_capacity       DECIMAL(10, 2) NOT NULL,
    -- Длина по осям автосцепок (мм)
    length              INT            NOT NULL,
    -- Количество осей
    axle_count          INT            NOT NULL,
    -- Вместимость (метры кубические)
    volume              DECIMAL(10, 2) NOT NULL,
    -- Наполнение (метры кубические)
    filling_volume      DECIMAL(10, 2),
    -- Первоначальная тара (тн) 
    initial_tare_weight DECIMAL(10, 2),
    -- Тип
    type_id             UUID           NOT NULL REFERENCES wagon_types (id),
    -- Модель
    model_id            UUID REFERENCES wagon_models (model_id),
    -- дата ввода в эксплуатацию
    commissioning_date  DATE,
    -- Заводской номер вагона
    serial_number       VARCHAR(30)    NOT NULL,
    -- Регистрационный номер
    registration_number VARCHAR(20)    NOT NULL UNIQUE,
    -- Дата регистрации
    registration_date   DATE           NOT NULL,
    -- Регистратор (справочник) - новое поле
    registrar_id        INT REFERENCES registrars (id),

    -- Примечания
    notes               TEXT,
    created_at          TIMESTAMP        DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP        DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE vessels
(
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    railway_cisterns_id  UUID UNIQUE NOT NULL REFERENCES railway_cisterns (id),
    -- Заводской номер сосуда - новое поле
    vessel_serial_number VARCHAR(30),
    -- Дата изготовления сосуда 
    vessel_build_date    DATE
);

CREATE TABLE depots
(
    depot_id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name       VARCHAR(100) NOT NULL,        -- Название депо
    code       VARCHAR(20)  NOT NULL UNIQUE, -- Код депо
    location   VARCHAR(100),                 -- Местоположение
    created_at TIMESTAMP        DEFAULT NOW()
);


CREATE TABLE parts
(
    part_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Уникальный ID детали
    part_type        VARCHAR(30) NOT NULL CHECK (                -- Тип детали
        part_type IN ('wheel_pair', 'side_frame', 'bolster', 'coupler', 'shock_absorber')
        ),
    depot_id         UUID REFERENCES depots (depot_id),
    stamp_number     VARCHAR(20) NOT NULL,                       -- Клеймо (номер вида 0005, 00029)
    serial_number    VARCHAR(50),                                -- Заводской номер
    manufacture_year INTEGER,                                    -- Год изготовления
    current_location VARCHAR(100),                               -- Текущее расположение
    status           VARCHAR(20)      DEFAULT 'active' CHECK (   -- Статус (активна, списана, продлена)
        status IN ('active', 'decommissioned', 'extended')
        ),
    notes            TEXT,                                       -- Примечания (лом, брак)
    created_at       TIMESTAMP        DEFAULT NOW()              -- Дата создания записи
);

CREATE TABLE wheel_pairs
(                                                                                  -- Колёсные пары
    part_id         UUID PRIMARY KEY REFERENCES parts (part_id) ON DELETE CASCADE, -- Ссылка на основную запись детали
    thickness_left  DECIMAL(5, 2),                                                 -- Толщина Л (мм)
    thickness_right DECIMAL(5, 2),                                                 -- Толщина П (мм)
    wheel_type      VARCHAR(50)                                                    -- Тип колёсной пары
);

CREATE TABLE side_frames
(                                                                                     -- Боковые рамы
    part_id            UUID PRIMARY KEY REFERENCES parts (part_id) ON DELETE CASCADE, -- Ссылка на основную запись детали
    service_life_years INTEGER,                                                       -- Отработанный срок (лет)
    extended_until     DATE                                                           -- Срок службы продлен до
);

CREATE TABLE bolsters
(                                                                                     -- Надрессорные балки
    part_id            UUID PRIMARY KEY REFERENCES parts (part_id) ON DELETE CASCADE, -- Ссылка на основную запись детали
    service_life_years INTEGER,                                                       -- Отработанный срок (лет)
    extended_until     DATE                                                           -- Срок службы продлен до
);


CREATE TABLE couplers
(                                                                         -- Автосцепка
    part_id UUID PRIMARY KEY REFERENCES parts (part_id) ON DELETE CASCADE -- Ссылка на основную запись детали
);

CREATE TABLE shock_absorbers
(                                                                                     -- Поглощающие аппараты
    part_id            UUID PRIMARY KEY REFERENCES parts (part_id) ON DELETE CASCADE, -- Ссылка на основную запись детали
    model              VARCHAR(50),                                                   -- Модель аппарата
    manufacturer_code  VARCHAR(20),                                                   -- Код предприятия-изготовителя
    next_repair_date   DATE,                                                          -- Дата следующего ремонта
    service_life_years INTEGER                                                        -- Отработанный срок (лет)
);


CREATE TABLE locations
(
    location_id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Уникальный ID местоположения
    name        VARCHAR(100) NOT NULL UNIQUE,               -- Название места (например, "Склад №1", "Белвторчермет")
    type        VARCHAR(50)  NOT NULL CHECK (               -- Тип местоположения
        type IN ('warehouse', 'wagon', 'repair_shop', 'scrap_yard', 'other')
        ),
    description TEXT                                        -- Дополнительное описание
);

CREATE TABLE part_installations
(                                                                                     -- Установки деталей (перемещение)
    installation_id  UUID PRIMARY KEY   DEFAULT gen_random_uuid(),                    -- Уникальный ID записи об установке
    part_id          UUID      NOT NULL REFERENCES parts (part_id) ON DELETE CASCADE, -- ID детали
    wagon_id         UUID      REFERENCES railway_cisterns (id) ON DELETE SET NULL,   -- ID вагона (если установлено на вагон)
    installed_at     TIMESTAMP NOT NULL DEFAULT NOW(),                                -- Дата установки
    installed_by     VARCHAR(100),                                                    -- Кто установил
    removed_at       TIMESTAMP,                                                       -- Дата снятия
    removed_by       VARCHAR(100),                                                    -- Кто снял
    from_location_id UUID REFERENCES locations (location_id),                         -- Откуда (ссылка на справочник)
    to_location_id   UUID      NOT NULL REFERENCES locations (location_id),           -- Куда (ссылка на справочник)
    notes            TEXT                                                             -- Примечания
);

-- Таблица видов ремонта
CREATE TABLE repair_types
(
    repair_type_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name           VARCHAR(100) NOT NULL,        -- Название вида ремонта
    code           VARCHAR(20)  NOT NULL UNIQUE, -- Код вида ремонта
    description    TEXT,                         -- Описание
    created_at     TIMESTAMP        DEFAULT NOW()
);

-- Таблица ремонтов
CREATE TABLE repairs
(
    repair_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    part_id          UUID NOT NULL REFERENCES parts (part_id),               -- Ссылка на деталь
    repair_type_id   UUID NOT NULL REFERENCES repair_types (repair_type_id), -- Вид ремонта
    repair_date      DATE NOT NULL,                                          -- Дата ремонта
    depot_id         UUID REFERENCES depots (depot_id),                      -- Где выполнен ремонт
    next_repair_date DATE,                                                   -- Планируемая дата следующего ремонта
    created_at       TIMESTAMP        DEFAULT NOW(),
    CONSTRAINT valid_dates CHECK (next_repair_date IS NULL OR next_repair_date >= repair_date)
);
