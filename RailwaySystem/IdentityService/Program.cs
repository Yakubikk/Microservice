// IdentityService\Program.cs

using Microsoft.AspNetCore.Identity;
using Microsoft.OpenApi.Models;
using RailwaySystem.ServiceDefaults;

var builder = WebApplication.CreateBuilder(args);

// Добавляем стандартные сервисы Aspire
builder.AddServiceDefaults();

// Использование метода UseIdentity для настройки Identity
builder.UseIdentity("IdentityDb");

// Добавляем Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo 
    { 
        Title = "Identity Service API", 
        Version = "v1",
        Description = "Authentication and authorization service"
    });

    // Настройка Bearer в Swagger
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please enter a valid Bearer token",
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer"
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

// Настройка Swagger UI
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Identity Service v1");
        c.OAuthClientId("swagger-ui");
        c.OAuthAppName("Swagger UI");
    });

    // Применяем миграции только в Development
    // app.ApplyIdentityMigrations<ApplicationIdentityDbContext>();
}

app.MapDefaultEndpoints();
app.MapGroup("/auth").MapIdentityApi<IdentityUser<Guid>>();

app.Run();
