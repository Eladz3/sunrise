using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SunriseApi.Migrations
{
    /// <inheritdoc />
    public partial class MakeFirebaseIdString : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FirebaseId",
                table: "Users");

            migrationBuilder.AddColumn<string>(
                name: "FirebaseUid",
                table: "Users",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FirebaseUid",
                table: "Users");

            migrationBuilder.AddColumn<int>(
                name: "FirebaseId",
                table: "Users",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
