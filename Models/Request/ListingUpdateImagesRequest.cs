namespace Eclipse_Market.Models.Request
{
    public class ListingUpdateImagesRequest
    {
        public int ListingId { get; set; }
        public List<string> ImageBase64Strings { get; set; }
    }
}
