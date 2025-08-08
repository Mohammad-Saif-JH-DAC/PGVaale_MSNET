using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using System;
using System.Net.Mail;
using System.Net;

namespace PGVaaleDotNetBackend.Services
{
    public class EmailService
    {
        private readonly ILogger<EmailService> _logger;
        private readonly string _smtpServer;
        private readonly int _smtpPort;
        private readonly string _smtpUsername;
        private readonly string _smtpPassword;
        private readonly bool _enableSsl;

        public EmailService(ILogger<EmailService> logger, IConfiguration configuration)
        {
            _logger = logger;
            // Get SMTP settings from configuration
            _smtpServer = configuration["Email:SmtpServer"] ?? "smtp.gmail.com";
            _smtpPort = int.TryParse(configuration["Email:SmtpPort"], out var port) ? port : 587;
            _smtpUsername = configuration["Email:SmtpUsername"] ?? "";
            _smtpPassword = configuration["Email:SmtpPassword"] ?? "";
            _enableSsl = bool.TryParse(configuration["Email:EnableSsl"], out var ssl) ? ssl : true;
        }

        /// <summary>
        /// Send welcome email to newly registered users
        /// </summary>
        public void SendUserWelcomeEmail(string toEmail, string userName)
        {
            try
            {
                var subject = "Welcome to PGVaale - Your Account is Ready!";
                var message = BuildUserWelcomeMessage(userName);
                SendEmail(toEmail, subject, message);
                _logger.LogInformation("Welcome email sent successfully to user: {Email}", toEmail);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send welcome email to user: {Email}", toEmail);
            }
        }

        /// <summary>
        /// Send welcome email to newly registered owners
        /// </summary>
        public void SendOwnerWelcomeEmail(string toEmail, string ownerName)
        {
            try
            {
                var subject = "Welcome to PGVaale - Start Managing Your Properties!";
                var message = BuildOwnerWelcomeMessage(ownerName);
                SendEmail(toEmail, subject, message);
                _logger.LogInformation("Welcome email sent successfully to owner: {Email}", toEmail);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send welcome email to owner: {Email}", toEmail);
            }
        }

        /// <summary>
        /// Build welcome message for users
        /// </summary>
        private string BuildUserWelcomeMessage(string userName)
        {
            return $@"Dear {userName},

Welcome to PGVaale! 🏠

Your account has been successfully created. You can now:
• Browse available PG accommodations
• Search for properties in your preferred location
• Connect with property owners
• Manage your profile and preferences

We're excited to help you find the perfect accommodation that suits your needs.

If you have any questions or need assistance, please don't hesitate to contact our support team.

Happy house hunting!

Best regards,
The PGVaale Team

---
This is an automated message. Please do not reply to this email.";
        }

        /// <summary>
        /// Build welcome message for owners
        /// </summary>
        private string BuildOwnerWelcomeMessage(string ownerName)
        {
            return $@"Dear {ownerName},

Welcome to PGVaale - Property Owner Portal! 🏢

Your owner account has been successfully created. You can now:
• List your PG properties
• Manage property details and amenities
• Upload property photos
• Connect with potential tenants
• Track inquiries and bookings
• Update availability and pricing

Start listing your properties today and reach thousands of potential tenants looking for quality accommodations.

Our platform is designed to make property management simple and efficient. If you need any help getting started, our support team is here to assist you.

Thank you for choosing PGVaale to showcase your properties!

Best regards,
The PGVaale Team

---
This is an automated message. Please do not reply to this email.";
        }

        /// <summary>
        /// Send pending approval email to Maid/Tiffin service providers
        /// </summary>
        public void SendPendingApprovalEmail(string toEmail, string providerName, string serviceType)
        {
            try
            {
                var subject = "Registration Received - Pending Admin Approval";
                var message = BuildPendingApprovalMessage(providerName, serviceType);
                SendEmail(toEmail, subject, message);
                _logger.LogInformation("Pending approval email sent successfully to {ServiceType} provider: {Email}", serviceType, toEmail);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send pending approval email to {ServiceType} provider: {Email}", serviceType, toEmail);
            }
        }

        /// <summary>
        /// Send approval confirmation email to Maid/Tiffin service providers
        /// </summary>
        public void SendApprovalConfirmationEmail(string toEmail, string providerName, string serviceType)
        {
            try
            {
                var subject = "Congratulations! Your Registration has been Approved";
                var message = BuildApprovalConfirmationMessage(providerName, serviceType);
                SendEmail(toEmail, subject, message);
                _logger.LogInformation("Approval confirmation email sent successfully to {ServiceType} provider: {Email}", serviceType, toEmail);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send approval confirmation email to {ServiceType} provider: {Email}", serviceType, toEmail);
            }
        }

        /// <summary>
        /// Unified method to send welcome email based on user type
        /// </summary>
        public void SendWelcomeEmail(string toEmail, string userName, string userType)
        {
            if (string.Equals(userType, "User", StringComparison.OrdinalIgnoreCase))
            {
                SendUserWelcomeEmail(toEmail, userName);
            }
            else if (string.Equals(userType, "Owner", StringComparison.OrdinalIgnoreCase))
            {
                SendOwnerWelcomeEmail(toEmail, userName);
            }
            else if (string.Equals(userType, "Maid", StringComparison.OrdinalIgnoreCase) || 
                     string.Equals(userType, "Tiffin", StringComparison.OrdinalIgnoreCase))
            {
                SendPendingApprovalEmail(toEmail, userName, userType);
            }
            else
            {
                _logger.LogWarning("Unknown user type '{UserType}' for welcome email to: {Email}", userType, toEmail);
                // Default to user welcome email
                SendUserWelcomeEmail(toEmail, userName);
            }
        }

        /// <summary>
        /// Build pending approval message for Maid/Tiffin service providers
        /// </summary>
        private string BuildPendingApprovalMessage(string providerName, string serviceType)
        {
            return $@"Dear {providerName},

Thank you for registering as a {serviceType} service provider with PGVaale! 🎉

Your registration has been successfully received and you're one step closer to joining our platform.

📋 What happens next?
• Your application is currently under review by our admin team
• We will verify your details and credentials
• Once approved, you'll receive a confirmation email
• After approval, you can start offering your services to our community

⏰ Review Process:
Our admin team typically reviews applications within 24-48 hours. We appreciate your patience during this process.

📞 Need Help?
If you have any questions or need to update your information, please contact our support team.

Thank you for choosing PGVaale to grow your {serviceType} service business!

Best regards,
The PGVaale Team

---
This is an automated message. Please do not reply to this email.";
        }

        /// <summary>
        /// Build approval confirmation message for Maid/Tiffin service providers
        /// </summary>
        private string BuildApprovalConfirmationMessage(string providerName, string serviceType)
        {
            return $@"Dear {providerName},

🎉 Congratulations! Your {serviceType} service provider registration has been APPROVED! 🎉

Welcome to the PGVaale family! You are now officially part of our trusted service provider network.

✅ What you can do now:
• Log in to your provider dashboard
• Complete your service profile
• Set your availability and pricing
• Start receiving service requests from customers
• Manage your bookings and earnings

🚀 Getting Started:
1. Log in to your account using your registered credentials
2. Complete your profile with service details
3. Upload any additional photos or certificates
4. Set your service areas and availability
5. Start accepting bookings!

💡 Tips for Success:
• Keep your profile updated and professional
• Respond promptly to customer inquiries
• Maintain high service quality
• Build positive customer relationships

We're excited to have you on board and look forward to your success on our platform!

If you need any assistance getting started, our support team is here to help.

Best regards,
The PGVaale Team

---
This is an automated message. Please do not reply to this email.";
        }

        /// <summary>
        /// Generic method to send any email
        /// </summary>
        public void SendEmail(string toEmail, string subject, string message)
        {
            try
            {
                // Check if SMTP credentials are configured
                if (string.IsNullOrEmpty(_smtpUsername) || string.IsNullOrEmpty(_smtpPassword))
                {
                    _logger.LogWarning("SMTP credentials not configured. Email would be sent to: {Email}", toEmail);
                    _logger.LogInformation("Email Subject: {Subject}", subject);
                    _logger.LogInformation("Email Body: {Message}", message);
                    return; // Don't throw exception, just log and return
                }

                using var client = new SmtpClient(_smtpServer, _smtpPort)
                {
                    EnableSsl = _enableSsl,
                    Credentials = new NetworkCredential(_smtpUsername, _smtpPassword)
                };

                var mailMessage = new MailMessage
                {
                    From = new MailAddress(_smtpUsername),
                    Subject = subject,
                    Body = message,
                    IsBodyHtml = false
                };
                mailMessage.To.Add(toEmail);

                client.Send(mailMessage);
                _logger.LogInformation("Email sent successfully to: {Email}", toEmail);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send email to: {Email}", toEmail);
                // Don't throw the exception, just log it
            }
        }
    }
}
