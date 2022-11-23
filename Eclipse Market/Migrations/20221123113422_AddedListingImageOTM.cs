using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Eclipse_Market.Migrations
{
    public partial class AddedListingImageOTM : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImageBase64String",
                table: "Listings");

            migrationBuilder.AddColumn<int>(
                name: "ImageId",
                table: "Images",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ListingId",
                table: "Images",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Images_ListingId",
                table: "Images",
                column: "ListingId");

            migrationBuilder.AddForeignKey(
                name: "FK_Images_Listings_ListingId",
                table: "Images",
                column: "ListingId",
                principalTable: "Listings",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Images_Listings_ListingId",
                table: "Images");

            migrationBuilder.DropIndex(
                name: "IX_Images_ListingId",
                table: "Images");

            migrationBuilder.DropColumn(
                name: "ImageId",
                table: "Images");

            migrationBuilder.DropColumn(
                name: "ListingId",
                table: "Images");

            migrationBuilder.AddColumn<string>(
                name: "ImageBase64String",
                table: "Listings",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
