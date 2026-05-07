using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SunriseApi.Migrations
{
    /// <inheritdoc />
    public partial class FirebaseIdToString : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "FirebaseId",
                table: "Users",
                type: "nvarchar(128)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.RenameColumn(
                name: "FirebaseId",
                table: "Users",
                newName: "FirebaseUid");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "FirebaseUid",
                table: "Users",
                newName: "FirebaseId");

            migrationBuilder.AlterColumn<int>(
                name: "FirebaseId",
                table: "Users",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(string),
                oldType: "nvarchar(128)",
                oldNullable: false);
        }
    }
}
