using Microsoft.AspNetCore.Mvc;

namespace SunriseApi.Controllers
{
    [ApiController]
    [Route("version")]
    public class VersionController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(new
            {
                sha = Environment.GetEnvironmentVariable("BUILD_SHA") ?? "unknown",
                version = Environment.GetEnvironmentVariable("BUILD_VERSION") ?? "unknown",
                deployedAt = Environment.GetEnvironmentVariable("DEPLOY_TIMESTAMP") ?? "unknown"
            });
        }
    }
}
