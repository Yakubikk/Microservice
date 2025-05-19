var builder = DistributedApplication.CreateBuilder(args);

var apiService = builder.AddProject<Projects.AspireApp_ApiService>("apiservice")
    .WithHttpHealthCheck("/health");

var frontend = builder.AddExecutable("frontend", 
        "npm", 
        workingDirectory: "../AspireApp.React",
        "run", "dev")
    .WithHttpHealthCheck("/health")
    .WithHttpEndpoint(port: 3000, env: "PORT")
    .WithReference(apiService);

builder.Build().Run();
