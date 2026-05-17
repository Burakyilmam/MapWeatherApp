using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MapWeatherApp.API.Migrations
{
    /// <inheritdoc />
    public partial class migration_1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Cities",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PlateCode = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Country = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Latitude = table.Column<double>(type: "float", nullable: false),
                    Longitude = table.Column<double>(type: "float", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cities", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ForecastDailies",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CityId = table.Column<int>(type: "int", nullable: false),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    MinTemp = table.Column<double>(type: "float", nullable: false),
                    MaxTemp = table.Column<double>(type: "float", nullable: false),
                    AvgTemp = table.Column<double>(type: "float", nullable: false),
                    ChanceOfRain = table.Column<int>(type: "int", nullable: false),
                    ConditionText = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ConditionIcon = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ForecastDailies", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ForecastHourlies",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CityId = table.Column<int>(type: "int", nullable: false),
                    Time = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Temperature = table.Column<double>(type: "float", nullable: false),
                    Humidity = table.Column<int>(type: "int", nullable: false),
                    WindSpeed = table.Column<double>(type: "float", nullable: false),
                    ChanceOfRain = table.Column<int>(type: "int", nullable: false),
                    ConditionIcon = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ForecastHourlies", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "WeatherHistories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CityId = table.Column<int>(type: "int", nullable: false),
                    Temperature = table.Column<double>(type: "float", nullable: false),
                    Humidity = table.Column<int>(type: "int", nullable: false),
                    WindSpeed = table.Column<double>(type: "float", nullable: false),
                    RecordedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WeatherHistories", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CurrentWeathers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CityId = table.Column<int>(type: "int", nullable: false),
                    Temperature = table.Column<double>(type: "float", nullable: false),
                    FeelsLike = table.Column<double>(type: "float", nullable: false),
                    Humidity = table.Column<int>(type: "int", nullable: false),
                    WindSpeed = table.Column<double>(type: "float", nullable: false),
                    UV = table.Column<double>(type: "float", nullable: false),
                    ConditionText = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ConditionIcon = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LastUpdated = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CurrentWeathers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CurrentWeathers_Cities_CityId",
                        column: x => x.CityId,
                        principalTable: "Cities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CurrentWeathers_CityId",
                table: "CurrentWeathers",
                column: "CityId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CurrentWeathers");

            migrationBuilder.DropTable(
                name: "ForecastDailies");

            migrationBuilder.DropTable(
                name: "ForecastHourlies");

            migrationBuilder.DropTable(
                name: "WeatherHistories");

            migrationBuilder.DropTable(
                name: "Cities");
        }
    }
}
