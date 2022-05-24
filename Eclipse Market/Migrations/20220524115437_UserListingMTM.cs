using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Eclipse_Market.Migrations
{
    public partial class UserListingMTM : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Listings_Users_AuthorId",
                table: "Listings");

            migrationBuilder.DropIndex(
                name: "IX_Listings_AuthorId",
                table: "Listings");

            migrationBuilder.DropColumn(
                name: "AuthorId",
                table: "Listings");

            migrationBuilder.CreateTable(
                name: "ListingUser",
                columns: table => new
                {
                    ListingsId = table.Column<int>(type: "int", nullable: false),
                    UsersId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ListingUser", x => new { x.ListingsId, x.UsersId });
                    table.ForeignKey(
                        name: "FK_ListingUser_Listings_ListingsId",
                        column: x => x.ListingsId,
                        principalTable: "Listings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ListingUser_Users_UsersId",
                        column: x => x.UsersId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ListingUser_UsersId",
                table: "ListingUser",
                column: "UsersId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ListingUser");

            migrationBuilder.AddColumn<int>(
                name: "AuthorId",
                table: "Listings",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Listings_AuthorId",
                table: "Listings",
                column: "AuthorId");

            migrationBuilder.AddForeignKey(
                name: "FK_Listings_Users_AuthorId",
                table: "Listings",
                column: "AuthorId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
