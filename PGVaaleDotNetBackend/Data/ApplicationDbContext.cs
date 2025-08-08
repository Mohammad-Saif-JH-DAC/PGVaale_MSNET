using Microsoft.EntityFrameworkCore;
using PGVaaleDotNetBackend.Entities;

namespace PGVaaleDotNetBackend.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Maid> Maids { get; set; }
        public DbSet<UserMaid> UserMaids { get; set; }
        public DbSet<Admin> Admins { get; set; }
        public DbSet<Tiffin> Tiffins { get; set; }
        public DbSet<UserTiffin> UserTiffins { get; set; }
        public DbSet<Menu> Menus { get; set; }
        public DbSet<Feedback_Tiffin> Feedback_Tiffins { get; set; }
        public DbSet<PgDetails> PgDetails { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<ChatMessage> ChatMessages { get; set; }
        public DbSet<ContactUs> ContactUs { get; set; }
        public DbSet<Feedback_Web> Feedback_Web { get; set; }
        public DbSet<Feedback> Feedback { get; set; }
        public DbSet<Owner> Owners { get; set; }
        public DbSet<PG> PGs { get; set; }
        public DbSet<Entities.ServiceProvider> ServiceProviders { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure User entity
            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("users");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnName("id").ValueGeneratedOnAdd();
                entity.Property(e => e.Username).HasColumnName("username");
                entity.Property(e => e.Password).HasColumnName("password");
                entity.Property(e => e.Email).HasColumnName("email");
                entity.Property(e => e.Name).HasColumnName("name");
                entity.Property(e => e.Aadhaar).HasColumnName("aadhaar");
                entity.Property(e => e.MobileNumber).HasColumnName("mobile_number");
                entity.Property(e => e.Age).HasColumnName("age");
                entity.Property(e => e.Gender).HasColumnName("gender");
            });

            // Configure Maid entity
            modelBuilder.Entity<Maid>(entity =>
            {
                entity.ToTable("maids");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnName("id").ValueGeneratedOnAdd(); // Using auto-increment
                entity.Property(e => e.Username).HasColumnName("username");
                entity.Property(e => e.Password).HasColumnName("password");
                entity.Property(e => e.Email).HasColumnName("email");
                entity.Property(e => e.Name).HasColumnName("name");
                entity.Property(e => e.PhoneNumber).HasColumnName("phone_number");
                entity.Property(e => e.Aadhaar).HasColumnName("aadhaar");
                entity.Property(e => e.Services).HasColumnName("services");
                entity.Property(e => e.MonthlySalary).HasColumnName("monthly_salary");
                entity.Property(e => e.Gender).HasColumnName("gender");
                entity.Property(e => e.Timing).HasColumnName("timing");
                entity.Property(e => e.Region).HasColumnName("region");
                entity.Property(e => e.Approved).HasColumnName("approved");
            });

            // Configure UserMaid entity
            modelBuilder.Entity<UserMaid>(entity =>
            {
                entity.ToTable("user_maid");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnName("id").ValueGeneratedOnAdd(); // user_maid table has AUTO_INCREMENT
                entity.Property(e => e.UserId).HasColumnName("user_id");
                entity.Property(e => e.MaidId).HasColumnName("maid_id");
                entity.Property(e => e.Status).HasColumnName("status");
                entity.Property(e => e.AssignedDateTime).HasColumnName("assigned_date_time");
                entity.Property(e => e.AcceptedDateTime).HasColumnName("accepted_date_time");
                entity.Property(e => e.DeletionDateTime).HasColumnName("deletion_date_time");
                entity.Property(e => e.UserAddress).HasColumnName("user_address");
                entity.Property(e => e.StartDate).HasColumnName("start_date");
                entity.Property(e => e.EndDate).HasColumnName("end_date");
                entity.Property(e => e.TimeSlot).HasColumnName("time_slot");

                // Configure relationships
                entity.HasOne(um => um.User)
                    .WithMany()
                    .HasForeignKey(um => um.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(um => um.Maid)
                    .WithMany()
                    .HasForeignKey(um => um.MaidId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Configure Admin entity
            modelBuilder.Entity<Admin>(entity =>
            {
                entity.ToTable("admins");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnName("id").ValueGeneratedOnAdd(); // Changed to auto-increment
                entity.Property(e => e.Username).HasColumnName("username");
                entity.Property(e => e.Password).HasColumnName("password");
                entity.Property(e => e.Email).HasColumnName("email");
                entity.Property(e => e.Name).HasColumnName("name");
            });

            // Configure Tiffin entity
            modelBuilder.Entity<Tiffin>(entity =>
            {
                entity.ToTable("tiffins");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnName("id").ValueGeneratedOnAdd();
                entity.Property(e => e.Username).HasColumnName("username");
                entity.Property(e => e.Password).HasColumnName("password");
                entity.Property(e => e.Email).HasColumnName("email");
                entity.Property(e => e.Name).HasColumnName("name");
                entity.Property(e => e.PhoneNumber).HasColumnName("phone_number");
                entity.Property(e => e.Aadhaar).HasColumnName("aadhaar");
                entity.Property(e => e.Price).HasColumnName("price");
                entity.Property(e => e.FoodCategory).HasColumnName("food_category");
                entity.Property(e => e.Region).HasColumnName("region");
                entity.Property(e => e.MaidAddress).HasColumnName("maid_address");
                entity.Property(e => e.Approved).HasColumnName("approved");
            });

            // Configure UserTiffin entity
            modelBuilder.Entity<UserTiffin>(entity =>
            {
                entity.ToTable("user_tiffins");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnName("id").ValueGeneratedOnAdd();
                entity.Property(e => e.Username).HasColumnName("username");
                entity.Property(e => e.Password).HasColumnName("password");
                entity.Property(e => e.Email).HasColumnName("email");
                entity.Property(e => e.Name).HasColumnName("name");
                entity.Property(e => e.UserId).HasColumnName("user_id");
                entity.Property(e => e.TiffinId).HasColumnName("tiffin_id");
                entity.Property(e => e.AssignedDateTime).HasColumnName("assigned_date_time");
                entity.Property(e => e.DeletionDateTime).HasColumnName("deletion_date_time");
                entity.Property(e => e.Status).HasColumnName("status");

                // Configure relationships
                entity.HasOne(ut => ut.User)
                    .WithMany()
                    .HasForeignKey(ut => ut.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(ut => ut.Tiffin)
                    .WithMany()
                    .HasForeignKey(ut => ut.TiffinId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Configure Menu entity
            modelBuilder.Entity<Menu>(entity =>
            {
                entity.ToTable("menus");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnName("id").ValueGeneratedOnAdd();
                entity.Property(e => e.Username).HasColumnName("username");
                entity.Property(e => e.Password).HasColumnName("password");
                entity.Property(e => e.Email).HasColumnName("email");
                entity.Property(e => e.Name).HasColumnName("name");
                entity.Property(e => e.TiffinId).HasColumnName("tiffin_id");
                entity.Property(e => e.DayOfWeek).HasColumnName("day_of_week");
                entity.Property(e => e.Breakfast).HasColumnName("breakfast");
                entity.Property(e => e.Lunch).HasColumnName("lunch");
                entity.Property(e => e.Dinner).HasColumnName("dinner");
                entity.Property(e => e.MenuDate).HasColumnName("menu_date");
                entity.Property(e => e.FoodCategory).HasColumnName("food_category");
                entity.Property(e => e.Price).HasColumnName("price");
                entity.Property(e => e.IsActive).HasColumnName("is_active");

                // Configure relationship
                entity.HasOne(m => m.Tiffin)
                    .WithMany()
                    .HasForeignKey(m => m.TiffinId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Configure Feedback_Tiffin entity
            modelBuilder.Entity<Feedback_Tiffin>(entity =>
            {
                entity.ToTable("feedback_tiffin");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnName("id").ValueGeneratedOnAdd();
                entity.Property(e => e.UserId).HasColumnName("user_id");
                entity.Property(e => e.TiffinId).HasColumnName("tiffin_id");
                entity.Property(e => e.Feedback).HasColumnName("feedback");
                entity.Property(e => e.Rating).HasColumnName("rating");

                // Configure relationships
                entity.HasOne(f => f.User)
                    .WithMany()
                    .HasForeignKey(f => f.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(f => f.Tiffin)
                    .WithMany()
                    .HasForeignKey(f => f.TiffinId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Configure PgDetails entity
            modelBuilder.Entity<PgDetails>(entity =>
            {
                entity.ToTable("pg_details");
                entity.HasKey(e => e.PgId);
                entity.Property(e => e.PgId).HasColumnName("pg_id").ValueGeneratedOnAdd();
                entity.Property(e => e.PgName).HasColumnName("pg_name");
                entity.Property(e => e.PgAddress).HasColumnName("pg_address");
                entity.Property(e => e.PgRent).HasColumnName("pg_rent");
            });

            // Configure Booking entity
            modelBuilder.Entity<Booking>(entity =>
            {
                entity.ToTable("bookings");
                entity.HasKey(e => e.BookingId);
                entity.Property(e => e.BookingId).HasColumnName("booking_id").ValueGeneratedOnAdd();
                entity.Property(e => e.UserId).HasColumnName("user_id");
                entity.Property(e => e.PgId).HasColumnName("pg_id");
                entity.Property(e => e.StartDate).HasColumnName("start_date");
                entity.Property(e => e.EndDate).HasColumnName("end_date");

                // Configure relationships
                entity.HasOne(b => b.User)
                    .WithMany()
                    .HasForeignKey(b => b.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(b => b.Pg)
                    .WithMany()
                    .HasForeignKey(b => b.PgId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Configure ChatMessage entity
            modelBuilder.Entity<ChatMessage>(entity =>
            {
                entity.ToTable("chat_messages");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnName("id").ValueGeneratedOnAdd();
                entity.Property(e => e.SenderId).HasColumnName("sender_id");
                entity.Property(e => e.ReceiverId).HasColumnName("receiver_id");
                entity.Property(e => e.Username).HasColumnName("username");
                entity.Property(e => e.Region).HasColumnName("region");
                entity.Property(e => e.Message).HasColumnName("message");
                entity.Property(e => e.Timestamp).HasColumnName("timestamp");

                // Configure relationships
                entity.HasOne(cm => cm.Sender)
                    .WithMany()
                    .HasForeignKey(cm => cm.SenderId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(cm => cm.Receiver)
                    .WithMany()
                    .HasForeignKey(cm => cm.ReceiverId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Configure ContactUs entity
            modelBuilder.Entity<ContactUs>(entity =>
            {
                entity.ToTable("contactUs");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnName("id").ValueGeneratedOnAdd();
                entity.Property(e => e.Name).HasColumnName("name");
                entity.Property(e => e.Email).HasColumnName("email");
                entity.Property(e => e.Phone).HasColumnName("phone");
                entity.Property(e => e.Message).HasColumnName("message");
            });

            // Configure Feedback_Web entity
            modelBuilder.Entity<Feedback_Web>(entity =>
            {
                entity.ToTable("feedback_web");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnName("id").ValueGeneratedOnAdd();
                entity.Property(e => e.Feedback).HasColumnName("feedback");
                entity.Property(e => e.Rating).HasColumnName("rating");
            });

            // Configure Feedback entity
            modelBuilder.Entity<Feedback>(entity =>
            {
                entity.ToTable("feedback");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnName("id").ValueGeneratedOnAdd();
                entity.Property(e => e.MaidId).HasColumnName("maid_id");
                entity.Property(e => e.UserId).HasColumnName("user_id");
                entity.Property(e => e.FeedbackText).HasColumnName("feedback");
                entity.Property(e => e.Rating).HasColumnName("rating");

                // Configure relationships
                entity.HasOne(f => f.Maid)
                    .WithMany()
                    .HasForeignKey(f => f.MaidId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(f => f.User)
                    .WithMany()
                    .HasForeignKey(f => f.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Configure Owner entity
            modelBuilder.Entity<Owner>(entity =>
            {
                entity.ToTable("owners");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnName("id").ValueGeneratedOnAdd();
                entity.Property(e => e.Username).HasColumnName("username");
                entity.Property(e => e.Password).HasColumnName("password");
                entity.Property(e => e.Email).HasColumnName("email");
                entity.Property(e => e.Name).HasColumnName("name");
                entity.Property(e => e.Age).HasColumnName("age");
                entity.Property(e => e.Aadhaar).HasColumnName("aadhaar");
                entity.Property(e => e.MobileNumber).HasColumnName("mobile_number");
                entity.Property(e => e.Region).HasColumnName("region");
            });

            // Configure PG entity
            modelBuilder.Entity<PG>(entity =>
            {
                entity.ToTable("pgs");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnName("id").ValueGeneratedOnAdd();
                entity.Property(e => e.OwnerId).HasColumnName("owner_id");
                entity.Property(e => e.UserId).HasColumnName("user_id");
                entity.Property(e => e.ImagePaths).HasColumnName("image_paths");
                entity.Property(e => e.Latitude).HasColumnName("latitude");
                entity.Property(e => e.Longitude).HasColumnName("longitude");
                entity.Property(e => e.Amenities).HasColumnName("amenities");
                entity.Property(e => e.NearbyResources).HasColumnName("nearby_resources");
                entity.Property(e => e.Rent).HasColumnName("rent");
                entity.Property(e => e.GeneralPreference).HasColumnName("general_preference");
                entity.Property(e => e.Region).HasColumnName("region");
                entity.Property(e => e.Availability).HasColumnName("availability");

                // Configure relationships
                entity.HasOne(pg => pg.Owner)
                    .WithMany()
                    .HasForeignKey(pg => pg.OwnerId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(pg => pg.RegisteredUser)
                    .WithMany()
                    .HasForeignKey(pg => pg.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Configure ServiceProvider entity
            modelBuilder.Entity<Entities.ServiceProvider>(entity =>
            {
                entity.ToTable("service_providers");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnName("id").ValueGeneratedOnAdd();
                entity.Property(e => e.Name).HasColumnName("name");
                entity.Property(e => e.Type).HasColumnName("type");
                entity.Property(e => e.Region).HasColumnName("region");
                entity.Property(e => e.Approved).HasColumnName("approved");
            });
        }
    }
}
