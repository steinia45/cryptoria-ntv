using Microsoft.EntityFrameworkCore.Migrations;

namespace CryptoDemo.Migrations
{
    public partial class AddedExchangeRatetoTransaction : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<float>(
                name: "ExchangeRate",
                table: "Transaction",
                nullable: false,
                defaultValue: 0f);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ExchangeRate",
                table: "Transaction");
        }
    }
}
