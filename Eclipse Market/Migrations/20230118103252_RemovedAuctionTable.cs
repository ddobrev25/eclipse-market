using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Eclipse_Market.Migrations
{
    public partial class RemovedAuctionTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Auctions");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Auctions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false),
                    BidIncrement = table.Column<double>(type: "float", nullable: false),
                    BuyoutPrice = table.Column<double>(type: "float", nullable: false),
                    ExpireTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ListingId = table.Column<int>(type: "int", nullable: false),
                    StartingPrice = table.Column<double>(type: "float", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Auctions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Auctions_Listings_Id",
                        column: x => x.Id,
                        principalTable: "Listings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });
        }
    }
}
