var builder = DistributedApplication.CreateBuilder(args);

// Настройка PostgreSQL без Docker (используя локальный сервер)
var authDb = builder.AddConnectionString("PostgresConnection");

var authService = builder.AddProject<Projects.AuthService_WebApi>("authservice")
    .WithReference(authDb);

var productService = builder.AddProject<Projects.ProductService_WebApi>("productservice");

builder.Build().Run();