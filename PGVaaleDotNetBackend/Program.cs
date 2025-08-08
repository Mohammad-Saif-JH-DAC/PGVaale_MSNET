

using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Identity;
using System.Text;
using PGVaaleDotNetBackend.Entities;
using PGVaaleDotNetBackend.Services;

var builder = WebApplication.CreateBuilder(args);

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactDev",
        policy => policy.WithOrigins("http://localhost:3000")
                        .WithMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .AllowAnyHeader()
                        .AllowCredentials());
});

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddControllers();

// Add JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:SecretKey"] ?? throw new InvalidOperationException("JWT SecretKey is not configured")))
        };
    });

// Add Entity Framework Core with MySQL
builder.Services.AddDbContext<PGVaaleDotNetBackend.Data.ApplicationDbContext>(options =>
    options.UseMySql(builder.Configuration.GetConnectionString("DefaultConnection"),
    ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection"))));

// Register services
builder.Services.AddScoped<PGVaaleDotNetBackend.Services.UserService>();
builder.Services.AddScoped<PGVaaleDotNetBackend.Services.MaidService>();
builder.Services.AddScoped<PGVaaleDotNetBackend.Services.UserMaidService>();
builder.Services.AddScoped<PGVaaleDotNetBackend.Services.AdminService>();
builder.Services.AddScoped<PGVaaleDotNetBackend.Services.TiffinService>();
builder.Services.AddScoped<PGVaaleDotNetBackend.Services.DashboardService>();
builder.Services.AddScoped<PGVaaleDotNetBackend.Services.EmailService>();
builder.Services.AddScoped<PGVaaleDotNetBackend.Services.JwtService>();
builder.Services.AddScoped<PGVaaleDotNetBackend.Repositories.IUserRepository, PGVaaleDotNetBackend.Repositories.UserRepository>();
builder.Services.AddScoped<PGVaaleDotNetBackend.Repositories.IMaidRepository, PGVaaleDotNetBackend.Repositories.MaidRepository>();
builder.Services.AddScoped<PGVaaleDotNetBackend.Repositories.IUserMaidRepository, PGVaaleDotNetBackend.Repositories.UserMaidRepository>();
builder.Services.AddScoped<PGVaaleDotNetBackend.Repositories.IAdminRepository, PGVaaleDotNetBackend.Repositories.AdminRepository>();
builder.Services.AddScoped<PGVaaleDotNetBackend.Repositories.ITiffinRepository, PGVaaleDotNetBackend.Repositories.TiffinRepository>();

// Add Password Hasher for Admin entity
builder.Services.AddScoped<IPasswordHasher<Admin>, PasswordHasher<Admin>>();

// Add Data Seeder Service
builder.Services.AddHostedService<DataSeederService>();
builder.Services.AddScoped<PGVaaleDotNetBackend.Repositories.IUserTiffinRepository, PGVaaleDotNetBackend.Repositories.UserTiffinRepository>();
builder.Services.AddScoped<PGVaaleDotNetBackend.Repositories.IMenuRepository, PGVaaleDotNetBackend.Repositories.MenuRepository>();
builder.Services.AddScoped<PGVaaleDotNetBackend.Repositories.IFeedback_TiffinRepository, PGVaaleDotNetBackend.Repositories.Feedback_TiffinRepository>();

var app = builder.Build();

// Use CORS
app.UseCors("AllowReactDev");

// Use Authentication and Authorization
app.UseAuthentication();
app.UseAuthorization();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast =  Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast");

app.MapControllers();
app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
