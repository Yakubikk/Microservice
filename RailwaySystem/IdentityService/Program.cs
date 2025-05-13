using Microsoft.AspNetCore.Identity;
using Microsoft.OpenApi.Models;
using RailwaySystem.ServiceDefaults.Data;

var builder = WebApplication.CreateBuilder(args);

// Добавляем стандартные сервисы Aspire
builder.AddServiceDefaults();
builder.AddDefaultAuthentication();
builder.AddIdentityDatabase("IdentityDb");

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

    // Настройка JWT в Swagger
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please enter a valid JWT token",
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        BearerFormat = "JWT",
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
    // app.ApplyMigrations<ApplicationIdentityDbContext>();
}

app.MapDefaultEndpoints();
app.MapIdentityApi<IdentityUser<Guid>>();

app.Run();
