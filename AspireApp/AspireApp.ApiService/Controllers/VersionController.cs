using Microsoft.AspNetCore.Mvc;
using System.Reflection;
using System.Runtime.Versioning;

namespace AspireApp.ApiService.Controllers;

[Route("api/[controller]")]
[ApiController]
public class VersionController : ControllerBase
{
    /// <summary>
    /// Получает информацию о версии приложения
    /// </summary>
    /// <returns>Информация о версии приложения</returns>
    [HttpGet]
    public IActionResult GetVersion()
    {
        var assembly = Assembly.GetExecutingAssembly();
        var assemblyVersion = assembly.GetName().Version?.ToString() ?? "Неизвестно";
        var fileVersion = assembly.GetCustomAttribute<AssemblyFileVersionAttribute>()?.Version ?? "Неизвестно";
        var targetFramework = assembly.GetCustomAttribute<TargetFrameworkAttribute>()?.FrameworkName ?? "Неизвестно";
        var informationalVersion = assembly.GetCustomAttribute<AssemblyInformationalVersionAttribute>()?.InformationalVersion ?? "Неизвестно";
        var buildDate = System.IO.File.GetLastWriteTime(assembly.Location);

        var versionInfo = new
        {
            Version = assemblyVersion,
            FileVersion = fileVersion,
            TargetFramework = targetFramework,
            InformationalVersion = informationalVersion,
            BuildDate = buildDate.ToString("yyyy-MM-dd HH:mm:ss"),
            Environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Неизвестно"
        };

        return Ok(versionInfo);
    }
}
