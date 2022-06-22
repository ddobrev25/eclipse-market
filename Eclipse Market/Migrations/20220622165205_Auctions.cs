using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Eclipse_Market.Migrations
{
    public partial class Auctions : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Auction_Listings_Id",
                table: "Auction");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Auction",
                table: "Auction");

            migrationBuilder.RenameTable(
                name: "Auction",
                newName: "Auctions");

            migrationBuilder.AddColumn<double>(
                name: "BidIncrement",
                table: "Auctions",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<int>(
                name: "ListingId",
                table: "Auctions",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Auctions",
                table: "Auctions",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Auctions_Listings_Id",
                table: "Auctions",
                column: "Id",
                principalTable: "Listings",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Auctions_Listings_Id",
                table: "Auctions");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Auctions",
                table: "Auctions");

            migrationBuilder.DropColumn(
                name: "BidIncrement",
                table: "Auctions");

            migrationBuilder.DropColumn(
                name: "ListingId",
                table: "Auctions");

            migrationBuilder.RenameTable(
                name: "Auctions",
                newName: "Auction");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Auction",
                table: "Auction",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Auction_Listings_Id",
                table: "Auction",
                column: "Id",
                principalTable: "Listings",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
