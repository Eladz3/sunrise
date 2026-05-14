using Microsoft.EntityFrameworkCore;
using SunriseApi.Data;
using SunriseApi.Mapping;
using SunriseApi.Services;
using SunriseApi.Services.Interfaces;
using Amazon.Lambda.AspNetCoreServer.Hosting;
using Microsoft.OpenApi.Models;
using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// 👇 REQUIRED: tells ASP.NET Core to run inside Lambda
builder.Services.AddAWSLambdaHosting(LambdaEventSource.HttpApi);

// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(o => o.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));

// Optional: Swagger
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddScoped<IGoalsService, GoalsService>();
builder.Services.AddScoped<IGroupsService, GroupsService>();
builder.Services.AddScoped<IMetricsService, MetricsService>();
builder.Services.AddScoped<IUsersService, UsersService>();

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

    // 🔐 Add JWT Bearer support for Swagger
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter: {your Firebase ID token}"
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
            new string[] {}
        }
    });
});

builder.Services.AddAutoMapper(typeof(MappingProfile));

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy
            .WithOrigins("http://localhost:3000", "http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure pipeline
if (!app.Environment.IsProduction())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Must be first: catches unhandled exceptions and ensures CORS headers
// are written even on 500 responses (default Kestrel error resets headers).
var corsOrigins = new[] { "http://localhost:3000", "http://localhost:5173" };
app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        var origin = context.Request.Headers.Origin.ToString();
        if (corsOrigins.Contains(origin))
        {
            context.Response.Headers["Access-Control-Allow-Origin"] = origin;
            context.Response.Headers["Vary"] = "Origin";
        }
        context.Response.StatusCode = StatusCodes.Status500InternalServerError;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsync("{\"error\":\"Internal server error\"}");
    });
});

// CORS before HTTPS redirect so preflight responses always carry the header.
app.UseCors();

// Only redirect to HTTPS in production; local dev runs on plain HTTP.
if (app.Environment.IsProduction())
{
    app.UseHttpsRedirection();
}

FirebaseInit.Initialize();

app.UseMiddleware<FirebaseAuthMiddleware>();

app.UseAuthorization();

app.MapControllers();

app.Run();
