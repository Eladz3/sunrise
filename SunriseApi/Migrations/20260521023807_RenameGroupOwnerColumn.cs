using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SunriseApi.Migrations
{
    /// <inheritdoc />
    public partial class RenameGroupOwnerColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Groups_Users_GroupOwnerId",
                table: "Groups");

            migrationBuilder.DropIndex(
                name: "IX_Groups_GroupOwnerId",
                table: "Groups");

            migrationBuilder.RenameColumn(
                name: "GroupOwnerId",
                table: "Groups",
                newName: "GroupOwnerUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Groups_GroupOwnerUserId",
                table: "Groups",
                column: "GroupOwnerUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Groups_Users_GroupOwnerUserId",
                table: "Groups",
                column: "GroupOwnerUserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Groups_Users_GroupOwnerUserId",
                table: "Groups");

            migrationBuilder.DropIndex(
                name: "IX_Groups_GroupOwnerUserId",
                table: "Groups");

            migrationBuilder.RenameColumn(
                name: "GroupOwnerUserId",
                table: "Groups",
                newName: "GroupOwnerId");

            migrationBuilder.CreateIndex(
                name: "IX_Groups_GroupOwnerId",
                table: "Groups",
                column: "GroupOwnerId");

            migrationBuilder.AddForeignKey(
                name: "FK_Groups_Users_GroupOwnerId",
                table: "Groups",
                column: "GroupOwnerId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
