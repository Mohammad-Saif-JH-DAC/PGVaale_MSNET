using PGVaaleDotNetBackend.Entities;
using PGVaaleDotNetBackend.Repositories;

namespace PGVaaleDotNetBackend.Services
{
    public class DataSeederService : IHostedService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<DataSeederService> _logger;

        public DataSeederService(IServiceProvider serviceProvider, ILogger<DataSeederService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        public async Task StartAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("=== Starting Data Initialization ===");
            
            using (var scope = _serviceProvider.CreateScope())
            {
                var adminRepository = scope.ServiceProvider.GetRequiredService<IAdminRepository>();
                
                await CreateDefaultAdminAsync(adminRepository);
            }
            
            _logger.LogInformation("=== Data Initialization Complete ===");
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            return Task.CompletedTask;
        }

        private async Task CreateDefaultAdminAsync(IAdminRepository adminRepository)
        {
            _logger.LogInformation("Checking for default admin...");
            
            // Check if default admin already exists
            var existingAdmin = await adminRepository.GetByUsernameAsync("admin");
            
            if (existingAdmin == null)
            {
                _logger.LogInformation("Default admin not found. Creating...");
                
                var defaultAdmin = new Admin
                {
                    Name = "System Admin",
                    Email = "admin@pgvaale.com",
                    Username = "admin"
                };
                
                // Hash the password using BCrypt
                string encodedPassword = BCrypt.Net.BCrypt.HashPassword("admin123");
                defaultAdmin.Password = encodedPassword;
                
                _logger.LogInformation("Admin details:");
                _logger.LogInformation("- Username: {Username}", defaultAdmin.Username);
                _logger.LogInformation("- Email: {Email}", defaultAdmin.Email);
                _logger.LogInformation("- Name: {Name}", defaultAdmin.Name);
                _logger.LogInformation("- Password (encoded): {EncodedPassword}", encodedPassword);
                _logger.LogInformation("- Default Password: admin123");
                
                var savedAdmin = await adminRepository.SaveAsync(defaultAdmin);
                _logger.LogInformation("Default admin created successfully with ID: {AdminId}", savedAdmin.Id);
                
                // Verify the admin was saved
                var verifyAdmin = await adminRepository.GetByUsernameAsync("admin");
                if (verifyAdmin != null)
                {
                    _logger.LogInformation("Admin verification successful - found in database");
                }
                else
                {
                    _logger.LogError("ERROR: Admin not found in database after save!");
                }
            }
            else
            {
                _logger.LogInformation("Default admin already exists!");
                
                _logger.LogInformation("Existing admin details:");
                _logger.LogInformation("- ID: {AdminId}", existingAdmin.Id);
                _logger.LogInformation("- Username: {Username}", existingAdmin.Username);
                _logger.LogInformation("- Email: {Email}", existingAdmin.Email);
                _logger.LogInformation("- Name: {Name}", existingAdmin.Name);
                
                // Check if password needs to be updated
                string expectedPassword = "admin123";
                try
                {
                    bool passwordIsValid = BCrypt.Net.BCrypt.Verify(expectedPassword, existingAdmin.Password);
                    
                    if (!passwordIsValid)
                    {
                        _logger.LogInformation("Updating admin password to: {ExpectedPassword}", expectedPassword);
                        existingAdmin.Password = BCrypt.Net.BCrypt.HashPassword(expectedPassword);
                        await adminRepository.SaveAsync(existingAdmin);
                        _logger.LogInformation("Admin password updated successfully");
                    }
                    else
                    {
                        _logger.LogInformation("Admin password is already correct");
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogWarning("Existing admin password is not in correct format. Updating to BCrypt format with password: {ExpectedPassword}", expectedPassword);
                    existingAdmin.Password = BCrypt.Net.BCrypt.HashPassword(expectedPassword);
                    await adminRepository.SaveAsync(existingAdmin);
                    _logger.LogInformation("Admin password updated successfully");
                }
                
                _logger.LogInformation("- Default Password: admin123");
            }
        }
    }
}
