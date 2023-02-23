using Eclipse_Market.Models.DB;

namespace Eclipse_Market.Services
{
    public class ValidationTokenService : IValidationTokenService
    {
        private EclipseMarketDbContext _dbContext;
        public ValidationTokenService(EclipseMarketDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public Guid Generate(int userId)
        {
            Guid guid = Guid.NewGuid();
            var validationToken = new ValidationToken
            {
                UserId = userId,
                Token = guid,
                ExpireTime = DateTime.UtcNow.AddMinutes(2),
            };

            _dbContext.ValidationTokens.Add(validationToken);
            _dbContext.SaveChanges();

            return guid;
        }

        public void Invalidate(Guid token)
        {
            var tokenToRemove = _dbContext.ValidationTokens
                .Where(x => x.Token == token)
                .FirstOrDefault();

            if (tokenToRemove is null)
            {
                return;
            }

            _dbContext.ValidationTokens.Remove(tokenToRemove);
            _dbContext.SaveChanges();
        }

        public bool IsValid(Guid token, int userId)
        {
            var tokenToValidate = _dbContext.ValidationTokens
                .Where(x => x.Token == token)
                .FirstOrDefault();

            if(tokenToValidate is null)
            {
                return false;
            }

            if(tokenToValidate.UserId != userId)
            {
                return false;
            }

            if(tokenToValidate.ExpireTime >= DateTime.UtcNow) 
            { 
                return false;
            }

            return true;
        }
    }
}
