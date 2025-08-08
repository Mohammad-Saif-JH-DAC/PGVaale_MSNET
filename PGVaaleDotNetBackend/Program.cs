

using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Identity;
using System.Text;
using PGVaaleDotNetBackend.Entities;
using PGVaaleDotNetBackend.Services;
using PGVaaleDotNetBackend.Security;
using PGVaaleDotNetBackend.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactDev",
        policy => policy.WithOrigins("http://localhost:3000")
                        .WithMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                        .AllowAnyHeader()
                        .WithExposedHeaders("Authorization", "Content-Type")
                        .AllowCredentials()
                        .SetPreflightMaxAge(TimeSpan.FromSeconds(3600)));
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
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Convert.FromBase64String("Wv3mRZ+bc5P69ZUI/epDWrKhfNRti/fvEbhN0v2NMWs=")),
            ClockSkew = TimeSpan.Zero
        };
    });

// Add Entity Framework Core with MySQL
builder.Services.AddDbContext<PGVaaleDotNetBackend.Data.ApplicationDbContext>(options =>
    options.UseMySql(builder.Configuration.GetConnectionString("DefaultConnection"),
    ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection"))));

// Register Security Services
builder.Services.AddScoped<IJwtUtil, JwtUtil>();
builder.Services.AddScoped<JwtRequestFilter>();
builder.Services.AddScoped<IUserDetailsService, CustomUserDetailsService>();

// Using BCrypt for password hashing instead of ASP.NET Core Identity

// Add Authorization Policies
builder.Services.AddAuthorization(options =>
{
    // Admin role policy
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("ADMIN"));
    
    // Owner role policy
    options.AddPolicy("OwnerOnly", policy => policy.RequireRole("OWNER"));
    
    // User role policy (USER or ADMIN)
    options.AddPolicy("UserOrAdmin", policy => policy.RequireRole("USER", "ADMIN"));
    
    // Maid role policy
    options.AddPolicy("MaidOnly", policy => policy.RequireRole("MAID"));
    
    // Tiffin role policy
    options.AddPolicy("TiffinOnly", policy => policy.RequireRole("TIFFIN"));
    
    // Owner, User, or Admin policy
    options.AddPolicy("OwnerUserOrAdmin", policy => policy.RequireRole("OWNER", "USER", "ADMIN"));
});

// Register services
builder.Services.AddScoped<PGVaaleDotNetBackend.Services.UserService>();
builder.Services.AddScoped<PGVaaleDotNetBackend.Services.MaidService>();
builder.Services.AddScoped<PGVaaleDotNetBackend.Services.UserMaidService>();
builder.Services.AddScoped<PGVaaleDotNetBackend.Services.AdminService>();
builder.Services.AddScoped<PGVaaleDotNetBackend.Services.TiffinService>();
builder.Services.AddScoped<PGVaaleDotNetBackend.Services.DashboardService>();
builder.Services.AddScoped<PGVaaleDotNetBackend.Services.EmailService>();
builder.Services.AddScoped<PGVaaleDotNetBackend.Services.JwtService>();
builder.Services.AddScoped<PGVaaleDotNetBackend.Services.PdfGeneratorService>();

// Register Repositories
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IMaidRepository, MaidRepository>();
builder.Services.AddScoped<IUserMaidRepository, UserMaidRepository>();
builder.Services.AddScoped<IAdminRepository, AdminRepository>();
builder.Services.AddScoped<ITiffinRepository, TiffinRepository>();
builder.Services.AddScoped<IOwnerRepository, OwnerRepository>();
builder.Services.AddScoped<IBookingRepository, BookingRepository>();
builder.Services.AddScoped<IChatMessageRepository, ChatMessageRepository>();
builder.Services.AddScoped<IContactUsRepository, ContactUsRepository>();
builder.Services.AddScoped<IFeedback_TiffinRepository, Feedback_TiffinRepository>();
builder.Services.AddScoped<IFeedback_WebRepository, Feedback_WebRepository>();
builder.Services.AddScoped<IFeedbackRepository, FeedbackRepository>();
builder.Services.AddScoped<IMenuRepository, MenuRepository>();
builder.Services.AddScoped<IPgDetailsRepository, PgDetailsRepository>();
builder.Services.AddScoped<IPGRepository, PGRepository>();
builder.Services.AddScoped<IServiceProviderRepository, ServiceProviderRepository>();
builder.Services.AddScoped<IUserTiffinRepository, UserTiffinRepository>();

// Add Data Seeder Service
builder.Services.AddHostedService<DataSeederService>();

var app = builder.Build();

// Use CORS
app.UseCors("AllowReactDev");

// Use JWT Request Filter (Custom Middleware)
app.UseMiddleware<JwtRequestFilter>();

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
