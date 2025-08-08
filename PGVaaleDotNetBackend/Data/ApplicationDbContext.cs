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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure User entity
            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("users");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnName("id").ValueGeneratedNever(); // Since DB doesn't have AUTO_INCREMENT
                entity.Property(e => e.Username).HasColumnName("username");
                entity.Property(e => e.Password).HasColumnName("password");
                entity.Property(e => e.Email).HasColumnName("email");
                entity.Property(e => e.Name).HasColumnName("name");
                entity.Property(e => e.UniqueId).HasColumnName("unique_id");
                // Remove CreatedAt and UpdatedAt as they don't exist in the database
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
                entity.Property(e => e.Id).HasColumnName("id").ValueGeneratedNever(); // Since DB doesn't have AUTO_INCREMENT
                entity.Property(e => e.Username).HasColumnName("username");
                entity.Property(e => e.Password).HasColumnName("password");
                entity.Property(e => e.Email).HasColumnName("email");
                entity.Property(e => e.Name).HasColumnName("name");
                entity.Property(e => e.Aadhaar).HasColumnName("aadhaar");
                entity.Property(e => e.Approved).HasColumnName("approved");
                entity.Property(e => e.Gender).HasColumnName("gender");
                entity.Property(e => e.MonthlySalary).HasColumnName("monthly_salary");
                entity.Property(e => e.PhoneNumber).HasColumnName("phone_number");
                entity.Property(e => e.Region).HasColumnName("region");
                entity.Property(e => e.Services).HasColumnName("services");
                entity.Property(e => e.Timing).HasColumnName("timing");
                entity.Property(e => e.Active).HasColumnName("active");
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
                entity.Property(e => e.Id).HasColumnName("id").ValueGeneratedNever(); // Since DB doesn't have AUTO_INCREMENT
                entity.Property(e => e.Username).HasColumnName("username");
                entity.Property(e => e.Password).HasColumnName("password");
                entity.Property(e => e.Email).HasColumnName("email");
                entity.Property(e => e.Name).HasColumnName("name");
                entity.Property(e => e.UniqueId).HasColumnName("unique_id");
            });

            // Configure Tiffin entity
            modelBuilder.Entity<Tiffin>(entity =>
            {
                entity.ToTable("tiffins");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnName("id").ValueGeneratedNever(); // Since DB doesn't have AUTO_INCREMENT
                entity.Property(e => e.Username).HasColumnName("username");
                entity.Property(e => e.Password).HasColumnName("password");
                entity.Property(e => e.Email).HasColumnName("email");
                entity.Property(e => e.Name).HasColumnName("name");
                entity.Property(e => e.PhoneNumber).HasColumnName("phone_number");
                entity.Property(e => e.Aadhaar).HasColumnName("aadhaar");
                entity.Property(e => e.Approved).HasColumnName("approved");
                entity.Property(e => e.FoodCategory).HasColumnName("food_category");
                entity.Property(e => e.MaidAddress).HasColumnName("maid_address");
                entity.Property(e => e.Price).HasColumnName("price");
                entity.Property(e => e.Region).HasColumnName("region");
            });

            // Configure UserTiffin entity
            modelBuilder.Entity<UserTiffin>(entity =>
            {
                entity.ToTable("user_tiffins");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnName("id").ValueGeneratedOnAdd(); // user_tiffins table has AUTO_INCREMENT
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
                entity.ToTable("feedback_tiffins");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnName("id").ValueGeneratedOnAdd();
                entity.Property(e => e.UserId).HasColumnName("user_id");
                entity.Property(e => e.TiffinId).HasColumnName("tiffin_id");
                entity.Property(e => e.Rating).HasColumnName("rating");
                entity.Property(e => e.Feedback).HasColumnName("feedback");
                entity.Property(e => e.CreatedAt).HasColumnName("created_at");

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
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnName("id").ValueGeneratedOnAdd();
                entity.Property(e => e.Username).HasColumnName("username");
                entity.Property(e => e.Password).HasColumnName("password");
                entity.Property(e => e.Email).HasColumnName("email");
                entity.Property(e => e.Name).HasColumnName("name");
                entity.Property(e => e.UniqueId).HasColumnName("unique_id");
                entity.Property(e => e.Address).HasColumnName("address");
                entity.Property(e => e.City).HasColumnName("city");
                entity.Property(e => e.State).HasColumnName("state");
                entity.Property(e => e.Pincode).HasColumnName("pincode");
                entity.Property(e => e.Description).HasColumnName("description");
                entity.Property(e => e.MonthlyRent).HasColumnName("monthly_rent");
                entity.Property(e => e.TotalRooms).HasColumnName("total_rooms");
                entity.Property(e => e.AvailableRooms).HasColumnName("available_rooms");
                entity.Property(e => e.Amenities).HasColumnName("amenities");
                entity.Property(e => e.Rules).HasColumnName("rules");
                entity.Property(e => e.IsActive).HasColumnName("is_active");
                entity.Property(e => e.CreatedAt).HasColumnName("created_at");
                entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
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
                    .WithMany(pg => pg.Bookings)
                    .HasForeignKey(b => b.PgId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}
