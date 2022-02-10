using Microsoft.EntityFrameworkCore.Migrations;

namespace CryptoDemo.Migrations
{
    public partial class TransactionDollarBuyAmountAdded : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<float>(
                name: "DollarBuyAmount",
                table: "Transaction",
                nullable: false,
                defaultValue: 0f);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DollarBuyAmount",
                table: "Transaction");
        }
    }
}
