namespace PGVaaleDotNetBackend.Security
{
    public interface IUserDetailsService
    {
        Task<UserDetails> LoadUserByUsernameAsync(string username);
    }

    public abstract class UserDetails
    {
        public abstract string Username { get; set; }
        public abstract string Password { get; set; }
        public abstract bool IsEnabled { get; set; }
    }
}
