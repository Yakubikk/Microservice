using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using RailwaySystem.ServiceDefaults;
using WagonService.Data;

var builder = WebApplication.CreateBuilder(args);

// Добавляем стандартные сервисы Aspire
builder.AddServiceDefaults();

// Добавляем поддержку Identity, используя строку подключения "IdentityDb"
// Важно: убедитесь, что строка подключения "IdentityDb" определена в конфигурации приложения.
// builder.UseIdentity("IdentityDb");

builder.Services.AddAuthentication(IdentityConstants.BearerScheme)
    .AddBearerToken(IdentityConstants.BearerScheme);
builder.Services.AddAuthorization();

// Регистрируем базу данных для сервиса Wagon
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("WagonDb")));

// Добавляем поддержку контроллеров
builder.Services.AddControllers();

// Настройка Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Wagon Service API", Version = "v1" });
    
    // Добавляем поддержку Bearer авторизации в Swagger
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "Bearer Authorization header using the Bearer scheme",
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

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => 
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Wagon Service v1");
    });
}

// Включаем middleware для аутентификации и авторизации
app.UseAuthentication();
app.UseAuthorization();

app.MapDefaultEndpoints();

app.MapControllers();

app.Run();
