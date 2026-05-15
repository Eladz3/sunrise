using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SunriseApi.Data;

namespace SunriseApi.Controllers
{
    [ApiController]
    [Route("health")]
    public class HealthController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(new
            {
                status = "ok",
                timestamp = DateTime.UtcNow
            });
        }

        [HttpGet("db-test")]
        public async Task<IActionResult> DbTest([FromServices] AppDbContext db)
        {
            var sw = Stopwatch.StartNew();

            var canConnect = await db.Database.CanConnectAsync();

            sw.Stop();

            return Ok(new
            {
                canConnect,
                ms = sw.ElapsedMilliseconds
            });
        }

        [HttpGet("ping")]
        public IActionResult Ping()
        {
            return Ok("ok");
        }

        [HttpGet("db-simple")]
        public async Task<IActionResult> DbSimple([FromServices] AppDbContext db)
        {
            var sw = Stopwatch.StartNew();

            var result = await db.Users.Take(1).ToListAsync();

            sw.Stop();

            return Ok(new
            {
                count = result.Count,
                ms = sw.ElapsedMilliseconds
            });
        }

        [HttpGet("internet-test")]
        public async Task<IActionResult> InternetTest()
        {
            try
            {
                using var client = new HttpClient();

                client.Timeout = TimeSpan.FromSeconds(5);

                var result = await client.GetAsync("https://example.com");

                return Ok(new
                {
                    status = result.StatusCode.ToString()
                });
            }
            catch (Exception ex)
            {
                return Ok(new
                {
                    error = ex.Message
                });
            }
        }
    }
}