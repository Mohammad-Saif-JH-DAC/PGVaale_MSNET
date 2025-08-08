namespace PGVaaleDotNetBackend.DTOs
{
    public class MenuDTO
    {
        public long Id { get; set; }
        public long TiffinId { get; set; }
        public string DayOfWeek { get; set; } = string.Empty;
        public string Breakfast { get; set; } = string.Empty;
        public string Lunch { get; set; } = string.Empty;
        public string Dinner { get; set; } = string.Empty;
        public DateTime MenuDate { get; set; }
        public string FoodCategory { get; set; } = string.Empty;
        public double Price { get; set; }
        public bool IsActive { get; set; } = true;
    }
}