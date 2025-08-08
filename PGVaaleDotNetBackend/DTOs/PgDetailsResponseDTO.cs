namespace PGVaaleDotNetBackend.DTOs
{
    public class PgDetailsResponseDTO
    {
        // Java: private String pgName;
        public string PgName { get; set; } = string.Empty;
        
        // Java: private String pgAddress;
        public string PgAddress { get; set; } = string.Empty;
        
        // Java: private Double pgRent;
        public double? PgRent { get; set; }
        
        // Java: private String startDate;
        public string StartDate { get; set; } = string.Empty;
        
        // Java: private String endDate;
        public string EndDate { get; set; } = string.Empty;

        // Default constructor
        public PgDetailsResponseDTO()
        {
        }

        // Constructor with all parameters (matching Java constructor)
        public PgDetailsResponseDTO(string pgName, string pgAddress, double? pgRent, string startDate, string endDate)
        {
            PgName = pgName;
            PgAddress = pgAddress;
            PgRent = pgRent;
            StartDate = startDate;
            EndDate = endDate;
        }
    }
}
