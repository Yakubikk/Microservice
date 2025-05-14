using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using WagonService.Data;

var builder = WebApplication.CreateBuilder(args);

// Добавляем стандартные сервисы Aspire
builder.AddServiceDefaults();
builder.AddDefaultAuthentication();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("WagonDb")));

// Добавляем поддержку контроллеров
builder.Services.AddControllers();

// Настройка Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Wagon Service API", Version = "v1" });
    
    // Добавляем поддержку JWT в Swagger
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer"
    });
    
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// Настройка конвейера запросов
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => 
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Wagon Service v1");
    });
    app.ApplyMigrations<ApplicationDbContext>();
}

app.MapDefaultEndpoints();

// Добавляем маршрутизацию контроллеров
app.MapControllers();

app.Run();
