using Microsoft.EntityFrameworkCore.Migrations;

namespace CryptoDemo.Migrations
{
    public partial class PfdollarAmontadded : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<float>(
                name: "DollarAmount",
                table: "Portfolio",
                nullable: false,
                defaultValue: 0f);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DollarAmount",
                table: "Portfolio");
        }
    }
}
