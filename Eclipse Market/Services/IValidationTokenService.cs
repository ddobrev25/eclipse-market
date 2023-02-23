namespace Eclipse_Market.Services
{
    public interface IValidationTokenService
    {
        Guid Generate(int userId);
        bool IsValid(Guid token, int userId);
        void Invalidate(Guid token);
    }
}
