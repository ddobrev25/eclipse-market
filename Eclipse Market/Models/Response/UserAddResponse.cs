﻿namespace Eclipse_Market.Models.Response
{
    public class UserAddResponse : IDefaultResponse
    {
        public bool ActionSucceeded { get; set; }
        public string Message { get; set; }
        public UserAddResponse(bool actionSucceeded, string message)
        {
            ActionSucceeded = actionSucceeded;
            Message = message;
        }
    }
}
