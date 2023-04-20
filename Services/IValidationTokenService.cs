namespace Eclipse_Market.Services
{
    public interface IValidationTokenService
    {
        Guid Generate(int userId, ValidationTokenType type);
        bool IsValid(Guid token, int userId, ValidationTokenType type);
        void Invalidate(Guid token);
    }
}
