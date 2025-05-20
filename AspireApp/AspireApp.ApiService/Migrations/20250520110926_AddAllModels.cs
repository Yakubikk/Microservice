using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AspireApp.ApiService.Migrations
{
    /// <inheritdoc />
    public partial class AddAllModels : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Wagons");

            migrationBuilder.AddColumn<string>(
                name: "Country",
                table: "Manufacturers",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "Depots",
                columns: table => new
                {
                    DepotId = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Code = table.Column<string>(type: "text", nullable: false),
                    Location = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Depots", x => x.DepotId);
                });

            migrationBuilder.CreateTable(
                name: "Locations",
                columns: table => new
                {
                    LocationId = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Locations", x => x.LocationId);
                });

            migrationBuilder.CreateTable(
                name: "Registrars",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Registrars", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "RepairTypes",
                columns: table => new
                {
                    RepairTypeId = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Code = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RepairTypes", x => x.RepairTypeId);
                });

            migrationBuilder.CreateTable(
                name: "WagonModels",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WagonModels", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "WagonTypes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WagonTypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Parts",
                columns: table => new
                {
                    PartId = table.Column<Guid>(type: "uuid", nullable: false),
                    PartType = table.Column<int>(type: "integer", nullable: false),
                    DepotId = table.Column<Guid>(type: "uuid", nullable: true),
                    StampNumber = table.Column<string>(type: "text", nullable: false),
                    SerialNumber = table.Column<string>(type: "text", nullable: true),
                    ManufactureYear = table.Column<int>(type: "integer", nullable: true),
                    CurrentLocation = table.Column<string>(type: "text", nullable: true),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    Notes = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Parts", x => x.PartId);
                    table.ForeignKey(
                        name: "FK_Parts_Depots_DepotId",
                        column: x => x.DepotId,
                        principalTable: "Depots",
                        principalColumn: "DepotId");
                });

            migrationBuilder.CreateTable(
                name: "RailwayCisterns",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Number = table.Column<string>(type: "text", nullable: false),
                    ManufacturerId = table.Column<Guid>(type: "uuid", nullable: false),
                    BuildDate = table.Column<DateOnly>(type: "date", nullable: false),
                    TareWeight = table.Column<decimal>(type: "numeric", nullable: false),
                    LoadCapacity = table.Column<decimal>(type: "numeric", nullable: false),
                    Length = table.Column<int>(type: "integer", nullable: false),
                    AxleCount = table.Column<int>(type: "integer", nullable: false),
                    Volume = table.Column<decimal>(type: "numeric", nullable: false),
                    FillingVolume = table.Column<decimal>(type: "numeric", nullable: true),
                    InitialTareWeight = table.Column<decimal>(type: "numeric", nullable: true),
                    TypeId = table.Column<Guid>(type: "uuid", nullable: false),
                    ModelId = table.Column<Guid>(type: "uuid", nullable: true),
                    CommissioningDate = table.Column<DateOnly>(type: "date", nullable: true),
                    SerialNumber = table.Column<string>(type: "text", nullable: false),
                    RegistrationNumber = table.Column<string>(type: "text", nullable: false),
                    RegistrationDate = table.Column<DateOnly>(type: "date", nullable: false),
                    RegistrarId = table.Column<Guid>(type: "uuid", nullable: true),
                    Notes = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatorId = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RailwayCisterns", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RailwayCisterns_Manufacturers_ManufacturerId",
                        column: x => x.ManufacturerId,
                        principalTable: "Manufacturers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RailwayCisterns_Registrars_RegistrarId",
                        column: x => x.RegistrarId,
                        principalTable: "Registrars",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_RailwayCisterns_WagonModels_ModelId",
                        column: x => x.ModelId,
                        principalTable: "WagonModels",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_RailwayCisterns_WagonTypes_TypeId",
                        column: x => x.TypeId,
                        principalTable: "WagonTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Bolsters",
                columns: table => new
                {
                    PartId = table.Column<Guid>(type: "uuid", nullable: false),
                    ServiceLifeYears = table.Column<int>(type: "integer", nullable: true),
                    ExtendedUntil = table.Column<DateOnly>(type: "date", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Bolsters", x => x.PartId);
                    table.ForeignKey(
                        name: "FK_Bolsters_Parts_PartId",
                        column: x => x.PartId,
                        principalTable: "Parts",
                        principalColumn: "PartId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Couplers",
                columns: table => new
                {
                    PartId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Couplers", x => x.PartId);
                    table.ForeignKey(
                        name: "FK_Couplers_Parts_PartId",
                        column: x => x.PartId,
                        principalTable: "Parts",
                        principalColumn: "PartId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Repairs",
                columns: table => new
                {
                    RepairId = table.Column<Guid>(type: "uuid", nullable: false),
                    PartId = table.Column<Guid>(type: "uuid", nullable: false),
                    RepairTypeId = table.Column<Guid>(type: "uuid", nullable: false),
                    RepairDate = table.Column<DateOnly>(type: "date", nullable: false),
                    DepotId = table.Column<Guid>(type: "uuid", nullable: true),
                    NextRepairDate = table.Column<DateOnly>(type: "date", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Repairs", x => x.RepairId);
                    table.ForeignKey(
                        name: "FK_Repairs_Depots_DepotId",
                        column: x => x.DepotId,
                        principalTable: "Depots",
                        principalColumn: "DepotId");
                    table.ForeignKey(
                        name: "FK_Repairs_Parts_PartId",
                        column: x => x.PartId,
                        principalTable: "Parts",
                        principalColumn: "PartId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Repairs_RepairTypes_RepairTypeId",
                        column: x => x.RepairTypeId,
                        principalTable: "RepairTypes",
                        principalColumn: "RepairTypeId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ShockAbsorbers",
                columns: table => new
                {
                    PartId = table.Column<Guid>(type: "uuid", nullable: false),
                    Model = table.Column<string>(type: "text", nullable: true),
                    ManufacturerCode = table.Column<string>(type: "text", nullable: true),
                    NextRepairDate = table.Column<DateOnly>(type: "date", nullable: true),
                    ServiceLifeYears = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ShockAbsorbers", x => x.PartId);
                    table.ForeignKey(
                        name: "FK_ShockAbsorbers_Parts_PartId",
                        column: x => x.PartId,
                        principalTable: "Parts",
                        principalColumn: "PartId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SideFrames",
                columns: table => new
                {
                    PartId = table.Column<Guid>(type: "uuid", nullable: false),
                    ServiceLifeYears = table.Column<int>(type: "integer", nullable: true),
                    ExtendedUntil = table.Column<DateOnly>(type: "date", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SideFrames", x => x.PartId);
                    table.ForeignKey(
                        name: "FK_SideFrames_Parts_PartId",
                        column: x => x.PartId,
                        principalTable: "Parts",
                        principalColumn: "PartId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "WheelPairs",
                columns: table => new
                {
                    PartId = table.Column<Guid>(type: "uuid", nullable: false),
                    ThicknessLeft = table.Column<decimal>(type: "numeric", nullable: true),
                    ThicknessRight = table.Column<decimal>(type: "numeric", nullable: true),
                    WheelType = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WheelPairs", x => x.PartId);
                    table.ForeignKey(
                        name: "FK_WheelPairs_Parts_PartId",
                        column: x => x.PartId,
                        principalTable: "Parts",
                        principalColumn: "PartId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PartInstallations",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    PartId = table.Column<Guid>(type: "uuid", nullable: false),
                    WagonId = table.Column<Guid>(type: "uuid", nullable: true),
                    InstalledAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    InstalledBy = table.Column<string>(type: "text", nullable: true),
                    RemovedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    RemovedBy = table.Column<string>(type: "text", nullable: true),
                    FromLocationId = table.Column<Guid>(type: "uuid", nullable: true),
                    ToLocationId = table.Column<Guid>(type: "uuid", nullable: false),
                    Notes = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PartInstallations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PartInstallations_Locations_FromLocationId",
                        column: x => x.FromLocationId,
                        principalTable: "Locations",
                        principalColumn: "LocationId");
                    table.ForeignKey(
                        name: "FK_PartInstallations_Locations_ToLocationId",
                        column: x => x.ToLocationId,
                        principalTable: "Locations",
                        principalColumn: "LocationId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PartInstallations_Parts_PartId",
                        column: x => x.PartId,
                        principalTable: "Parts",
                        principalColumn: "PartId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PartInstallations_RailwayCisterns_WagonId",
                        column: x => x.WagonId,
                        principalTable: "RailwayCisterns",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Vessels",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    RailwayCisternId = table.Column<Guid>(type: "uuid", nullable: false),
                    VesselSerialNumber = table.Column<string>(type: "text", nullable: true),
                    VesselBuildDate = table.Column<DateOnly>(type: "date", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Vessels", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Vessels_RailwayCisterns_RailwayCisternId",
                        column: x => x.RailwayCisternId,
                        principalTable: "RailwayCisterns",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PartInstallations_FromLocationId",
                table: "PartInstallations",
                column: "FromLocationId");

            migrationBuilder.CreateIndex(
                name: "IX_PartInstallations_PartId",
                table: "PartInstallations",
                column: "PartId");

            migrationBuilder.CreateIndex(
                name: "IX_PartInstallations_ToLocationId",
                table: "PartInstallations",
                column: "ToLocationId");

            migrationBuilder.CreateIndex(
                name: "IX_PartInstallations_WagonId",
                table: "PartInstallations",
                column: "WagonId");

            migrationBuilder.CreateIndex(
                name: "IX_Parts_DepotId",
                table: "Parts",
                column: "DepotId");

            migrationBuilder.CreateIndex(
                name: "IX_RailwayCisterns_ManufacturerId",
                table: "RailwayCisterns",
                column: "ManufacturerId");

            migrationBuilder.CreateIndex(
                name: "IX_RailwayCisterns_ModelId",
                table: "RailwayCisterns",
                column: "ModelId");

            migrationBuilder.CreateIndex(
                name: "IX_RailwayCisterns_RegistrarId",
                table: "RailwayCisterns",
                column: "RegistrarId");

            migrationBuilder.CreateIndex(
                name: "IX_RailwayCisterns_TypeId",
                table: "RailwayCisterns",
                column: "TypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Repairs_DepotId",
                table: "Repairs",
                column: "DepotId");

            migrationBuilder.CreateIndex(
                name: "IX_Repairs_PartId",
                table: "Repairs",
                column: "PartId");

            migrationBuilder.CreateIndex(
                name: "IX_Repairs_RepairTypeId",
                table: "Repairs",
                column: "RepairTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Vessels_RailwayCisternId",
                table: "Vessels",
                column: "RailwayCisternId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Bolsters");

            migrationBuilder.DropTable(
                name: "Couplers");

            migrationBuilder.DropTable(
                name: "PartInstallations");

            migrationBuilder.DropTable(
                name: "Repairs");

            migrationBuilder.DropTable(
                name: "ShockAbsorbers");

            migrationBuilder.DropTable(
                name: "SideFrames");

            migrationBuilder.DropTable(
                name: "Vessels");

            migrationBuilder.DropTable(
                name: "WheelPairs");

            migrationBuilder.DropTable(
                name: "Locations");

            migrationBuilder.DropTable(
                name: "RepairTypes");

            migrationBuilder.DropTable(
                name: "RailwayCisterns");

            migrationBuilder.DropTable(
                name: "Parts");

            migrationBuilder.DropTable(
                name: "Registrars");

            migrationBuilder.DropTable(
                name: "WagonModels");

            migrationBuilder.DropTable(
                name: "WagonTypes");

            migrationBuilder.DropTable(
                name: "Depots");

            migrationBuilder.DropColumn(
                name: "Country",
                table: "Manufacturers");

            migrationBuilder.CreateTable(
                name: "Wagons",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ManufacturerId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatorId = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Wagons", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Wagons_Manufacturers_ManufacturerId",
                        column: x => x.ManufacturerId,
                        principalTable: "Manufacturers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Wagons_ManufacturerId",
                table: "Wagons",
                column: "ManufacturerId");
        }
    }
}
