var builder = DistributedApplication.CreateBuilder(args);

// Настройка баз данных (теперь это просто строки подключения)
var identityDb = builder.AddConnectionString("IdentityDb");
var wagonDb = builder.AddConnectionString("WagonDb");
var fileDb = builder.AddConnectionString("FileDb");

var identityService = builder.AddProject<Projects.IdentityService>("identity")
    .WithReference(identityDb);

var wagonService = builder.AddProject<Projects.WagonService>("wagon")
    .WithReference(wagonDb)
    .WithReference(identityService);

// var fileService = builder.AddProject<Projects.FileService>("files")
//     .WithReference(fileDb)
//     .WithEnvironment("FILE_STORAGE_PATH", "storage")
//     .WithReference(identityService);

// var frontend = builder.AddNpmApp("frontend", "../frontend", "dev")
//     .WithReference(identityService)
//     .WithReference(wagonService)
//     // .WithReference(fileService)
//     .WithHttpEndpoint(env: "PORT");

builder.Build().Run();
