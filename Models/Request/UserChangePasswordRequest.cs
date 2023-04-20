namespace Eclipse_Market.Models.Request
{
    public class UserChangePasswordRequest
    {
        public string CurrentPassword { get; set; }
        public string NewPassword { get; set; }
    }
}
