namespace AspireApp.ApiService.DTO;

public class CountryInfo
{
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    
    public CountryInfo() { }

    private CountryInfo(string name, string code)
    {
        Name = name;
        Code = code;
    }
    
    public static CountryInfo FromString(string countryName)
    {
        // Базовая реализация с выборочными странами-производителями вагонов
        return countryName switch
        {
            "Республика Беларусь" => new CountryInfo("Республика Беларусь", "BY"),
            "Российская Федерация" => new CountryInfo("Российская Федерация", "RU"),
            "Украина" => new CountryInfo("Украина", "UA"),
            "Казахстан" => new CountryInfo("Казахстан", "KZ"),
            "Германия" => new CountryInfo("Германия", "DE"),
            "Китай" => new CountryInfo("Китай", "CN"),
            "Польша" => new CountryInfo("Польша", "PL"),
            "Латвия" => new CountryInfo("Латвия", "LV"),
            "Литва" => new CountryInfo("Литва", "LT"),
            "Эстония" => new CountryInfo("Эстония", "EE"),
            "Словакия" => new CountryInfo("Словакия", "SK"),
            "Чехия" => new CountryInfo("Чехия", "CZ"),
            "Италия" => new CountryInfo("Италия", "IT"),
            "Финляндия" => new CountryInfo("Финляндия", "FI"),
            "Франция" => new CountryInfo("Франция", "FR"),
            "Швеция" => new CountryInfo("Швеция", "SE"),
            "Австрия" => new CountryInfo("Австрия", "AT"),
            "Венгрия" => new CountryInfo("Венгрия", "HU"),
            "Болгария" => new CountryInfo("Болгария", "BG"),
            "Сербия" => new CountryInfo("Сербия", "RS"),
            "Словения" => new CountryInfo("Словения", "SI"),
            "Хорватия" => new CountryInfo("Хорватия", "HR"),
            "Румыния" => new CountryInfo("Румыния", "RO"),
            "Босния и Герцеговина" => new CountryInfo("Босния и Герцеговина", "BA"),
            "Черногория" => new CountryInfo("Черногория", "ME"),
            "Молдова" => new CountryInfo("Молдова", "MD"),
            "Турция" => new CountryInfo("Турция", "TR"),
            "Грузия" => new CountryInfo("Грузия", "GE"),
            "Армения" => new CountryInfo("Армения", "AM"),
            "Азербайджан" => new CountryInfo("Азербайджан", "AZ"),
            "Узбекистан" => new CountryInfo("Узбекистан", "UZ"),
            "Таджикистан" => new CountryInfo("Таджикистан", "TJ"),
            "Киргизия" => new CountryInfo("Киргизия", "KG"),
            "Туркменистан" => new CountryInfo("Туркменистан", "TM"),
            "Киргизская Республика" => new CountryInfo("Киргизская Республика", "KG"),
            _ => new CountryInfo(countryName, "")
        };
    }
    
    public override string ToString()
    {
        return Name;
    }
}

public class ManufacturerRequest
{
    public string Name { get; set; } = string.Empty;
    public string Country { get; set; } = "Республика Беларусь";
}

public class ManufacturerResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public CountryInfo Country { get; set; } = new();
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public string CreatorId { get; set; } = string.Empty;
}

public class ManufacturerDetailResponse : ManufacturerResponse
{
    public ICollection<RailwayCisternSummaryResponse>? Wagons { get; set; }
}

public class RailwayCisternSummaryResponse
{
    public Guid Id { get; set; }
    public string Number { get; set; } = string.Empty;
}
