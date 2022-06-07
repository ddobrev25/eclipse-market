﻿using System.ComponentModel.DataAnnotations;

namespace Eclipse_Market.Models.DB
{
    public class Message
    {
        public int Id { get; set; }
        [Required]
        public string Title { get; set; }
        [Required]
        public string Body { get; set; }
        [Required]
        public int RecieverId { get; set; }
        public User Reciever { get; set; }
        [Required]
        public int SenderId { get; set; }
        [Required]
        public int ListingId { get; set; }
    }
}