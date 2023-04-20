using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Eclipse_Market.Migrations
{
    public partial class AddedChatHubConnectionInDbContext : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ChatHubConnection_Users_UserId",
                table: "ChatHubConnection");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ChatHubConnection",
                table: "ChatHubConnection");

            migrationBuilder.RenameTable(
                name: "ChatHubConnection",
                newName: "ChatHubConnections");

            migrationBuilder.RenameIndex(
                name: "IX_ChatHubConnection_UserId",
                table: "ChatHubConnections",
                newName: "IX_ChatHubConnections_UserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ChatHubConnections",
                table: "ChatHubConnections",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ChatHubConnections_Users_UserId",
                table: "ChatHubConnections",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ChatHubConnections_Users_UserId",
                table: "ChatHubConnections");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ChatHubConnections",
                table: "ChatHubConnections");

            migrationBuilder.RenameTable(
                name: "ChatHubConnections",
                newName: "ChatHubConnection");

            migrationBuilder.RenameIndex(
                name: "IX_ChatHubConnections_UserId",
                table: "ChatHubConnection",
                newName: "IX_ChatHubConnection_UserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ChatHubConnection",
                table: "ChatHubConnection",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ChatHubConnection_Users_UserId",
                table: "ChatHubConnection",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
