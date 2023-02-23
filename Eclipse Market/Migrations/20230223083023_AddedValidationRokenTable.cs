using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Eclipse_Market.Migrations
{
    public partial class AddedValidationRokenTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ValidationTokens",
                columns: table => new
                {
                    Token = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    ExpireTime = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ValidationTokens", x => x.Token);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ValidationTokens");
        }
    }
}
