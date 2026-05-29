using Microsoft.AspNetCore.Mvc;
using SunriseApi.Services.Interfaces;

namespace SunriseApi.Controllers
{
    [ApiController]
    [Route("version")]
    public class VersionController(IVersionService versionService) : ControllerBase
    {
        [HttpGet]
        public IActionResult Get() => Ok(versionService.GetVersion());
    }
}
