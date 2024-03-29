﻿namespace Eclipse_Market.Models.Request
{
    public class UserUpdateRequest
    {
        public int Id { get; set; } = 0;
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string PhoneNumber { get; set; }
        public int RoleId { get; set; }
    }
}
