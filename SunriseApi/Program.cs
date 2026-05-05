using Microsoft.EntityFrameworkCore;
using SunriseApi.Data;
using SunriseApi.Mapping;
using SunriseApi.Services;
using SunriseApi.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Optional: keep OpenAPI (Swagger)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddScoped<IGoalsService, GoalsService>();
builder.Services.AddScoped<IGroupsService, GroupsService>();
builder.Services.AddScoped<IMetricsService, MetricsService>();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("SunriseSQLDatabaseConnectionString")
    ));

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new()
    {
        Title = "Sunrise API",
        Version = "v1",
        Description = "API for managing goals and groups"
    });
});

builder.Services.AddAutoMapper(typeof(MappingProfile));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Map controller routes
app.MapControllers();

app.Run();