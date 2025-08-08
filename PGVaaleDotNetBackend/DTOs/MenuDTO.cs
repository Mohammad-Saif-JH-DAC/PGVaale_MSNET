namespace PGVaaleDotNetBackend.DTOs
{
    // Java: @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public class MenuDTO
    {
        // Java: private Long id;
        public long Id { get; set; }
        
        // Java: private Long tiffinId;
        public long TiffinId { get; set; }
        
        // Java: private String dayOfWeek;
        public string DayOfWeek { get; set; } = string.Empty;
        
        // Java: private String breakfast;
        public string Breakfast { get; set; } = string.Empty;
        
        // Java: private String lunch;
        public string Lunch { get; set; } = string.Empty;
        
        // Java: private String dinner;
        public string Dinner { get; set; } = string.Empty;
        
        // Java: private LocalDate menuDate;
        public DateTime MenuDate { get; set; }
        
        // Java: private boolean isActive;
        public bool IsActive { get; set; }
        
        // Java: private String foodCategory;
        public string FoodCategory { get; set; } = string.Empty;
        
        // Java: private Double price;
        public double? Price { get; set; }

        // Default constructor (equivalent to @NoArgsConstructor)
        public MenuDTO()
        {
        }

        // Constructor with all parameters (equivalent to @AllArgsConstructor)
        public MenuDTO(
            long id,
            long tiffinId,
            string dayOfWeek,
            string breakfast,
            string lunch,
            string dinner,
            DateTime menuDate,
            bool isActive,
            string foodCategory,
            double? price)
        {
            Id = id;
            TiffinId = tiffinId;
            DayOfWeek = dayOfWeek;
            Breakfast = breakfast;
            Lunch = lunch;
            Dinner = dinner;
            MenuDate = menuDate;
            IsActive = isActive;
            FoodCategory = foodCategory;
            Price = price;
        }

        // Builder pattern (equivalent to @Builder)
        public class MenuDTOBuilder
        {
            private long _id;
            private long _tiffinId;
            private string _dayOfWeek = string.Empty;
            private string _breakfast = string.Empty;
            private string _lunch = string.Empty;
            private string _dinner = string.Empty;
            private DateTime _menuDate;
            private bool _isActive;
            private string _foodCategory = string.Empty;
            private double? _price;

            public MenuDTOBuilder Id(long id)
            {
                _id = id;
                return this;
            }

            public MenuDTOBuilder TiffinId(long tiffinId)
            {
                _tiffinId = tiffinId;
                return this;
            }

            public MenuDTOBuilder DayOfWeek(string dayOfWeek)
            {
                _dayOfWeek = dayOfWeek;
                return this;
            }

            public MenuDTOBuilder Breakfast(string breakfast)
            {
                _breakfast = breakfast;
                return this;
            }

            public MenuDTOBuilder Lunch(string lunch)
            {
                _lunch = lunch;
                return this;
            }

            public MenuDTOBuilder Dinner(string dinner)
            {
                _dinner = dinner;
                return this;
            }

            public MenuDTOBuilder MenuDate(DateTime menuDate)
            {
                _menuDate = menuDate;
                return this;
            }

            public MenuDTOBuilder IsActive(bool isActive)
            {
                _isActive = isActive;
                return this;
            }

            public MenuDTOBuilder FoodCategory(string foodCategory)
            {
                _foodCategory = foodCategory;
                return this;
            }

            public MenuDTOBuilder Price(double? price)
            {
                _price = price;
                return this;
            }

            public MenuDTO Build()
            {
                return new MenuDTO(
                    _id,
                    _tiffinId,
                    _dayOfWeek,
                    _breakfast,
                    _lunch,
                    _dinner,
                    _menuDate,
                    _isActive,
                    _foodCategory,
                    _price);
            }
        }

        // Static method to create builder (equivalent to Lombok @Builder)
        public static MenuDTOBuilder Builder()
        {
            return new MenuDTOBuilder();
        }
    }
}