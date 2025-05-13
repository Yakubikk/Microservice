var builder = DistributedApplication.CreateBuilder(args);

var postgres = builder.AddPostgres("postgres")
    .WithPgAdmin();

var identityDb = postgres.AddDatabase("IdentityDb");
var wagonDb = postgres.AddDatabase("WagonDb");
var fileDb = postgres.AddDatabase("FileDb");

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
