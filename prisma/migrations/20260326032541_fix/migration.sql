/*
  Warnings:

  - You are about to drop the column `solicitudId` on the `Contrato` table. All the data in the column will be lost.
  - You are about to drop the column `solicitudTrabajadorId` on the `Contrato` table. All the data in the column will be lost.
  - You are about to drop the column `trabajadorId` on the `Contrato` table. All the data in the column will be lost.
  - You are about to drop the column `monto` on the `SolicitudTrabajador` table. All the data in the column will be lost.
  - You are about to drop the column `trabajadorId` on the `SolicitudTrabajador` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[asignacionTrabajadorId]` on the table `Contrato` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `asignacionTrabajadorId` to the `Contrato` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cantidad` to the `SolicitudTrabajador` table without a default value. This is not possible if the table is not empty.
  - Added the required column `montoUnitario` to the `SolicitudTrabajador` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Contrato] DROP CONSTRAINT [Contrato_solicitudId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Contrato] DROP CONSTRAINT [Contrato_solicitudTrabajadorId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Contrato] DROP CONSTRAINT [Contrato_trabajadorId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[SolicitudTrabajador] DROP CONSTRAINT [SolicitudTrabajador_solicitudId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[SolicitudTrabajador] DROP CONSTRAINT [SolicitudTrabajador_trabajadorId_fkey];

-- DropIndex
ALTER TABLE [dbo].[Contrato] DROP CONSTRAINT [Contrato_solicitudTrabajadorId_key];

-- DropIndex
ALTER TABLE [dbo].[SolicitudTrabajador] DROP CONSTRAINT [SolicitudTrabajador_solicitudId_trabajadorId_key];

-- AlterTable
ALTER TABLE [dbo].[Contrato] DROP COLUMN [solicitudId],
[solicitudTrabajadorId],
[trabajadorId];
ALTER TABLE [dbo].[Contrato] ADD [asignacionTrabajadorId] INT NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[SolicitudTrabajador] DROP COLUMN [monto],
[trabajadorId];
ALTER TABLE [dbo].[SolicitudTrabajador] ADD [cantidad] INT NOT NULL,
[montoUnitario] FLOAT(53) NOT NULL,
[tarifaId] INT;

-- AlterTable
ALTER TABLE [dbo].[Turno] ADD [duracionHoras] FLOAT(53) NOT NULL CONSTRAINT [Turno_duracionHoras_df] DEFAULT 8;

-- CreateTable
CREATE TABLE [dbo].[AsignacionTrabajador] (
    [id] INT NOT NULL IDENTITY(1,1),
    [solicitudTrabajadorId] INT NOT NULL,
    [trabajadorId] INT NOT NULL,
    CONSTRAINT [AsignacionTrabajador_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [AsignacionTrabajador_solicitudTrabajadorId_trabajadorId_key] UNIQUE NONCLUSTERED ([solicitudTrabajadorId],[trabajadorId])
);

-- CreateTable
CREATE TABLE [dbo].[HistorialSolicitud] (
    [id] INT NOT NULL IDENTITY(1,1),
    [solicitudId] INT NOT NULL,
    [estadoId] INT NOT NULL,
    [fecha] DATETIME2 NOT NULL CONSTRAINT [HistorialSolicitud_fecha_df] DEFAULT CURRENT_TIMESTAMP,
    [comentario] NVARCHAR(1000),
    [usuarioId] INT NOT NULL,
    CONSTRAINT [HistorialSolicitud_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Tarifa] (
    [id] INT NOT NULL IDENTITY(1,1),
    [cargoId] INT NOT NULL,
    [turnoId] INT,
    [valorHora] FLOAT(53) NOT NULL,
    [vigenteDesde] DATETIME2 NOT NULL,
    [vigenteHasta] DATETIME2,
    CONSTRAINT [Tarifa_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [AsignacionTrabajador_solicitudTrabajadorId_idx] ON [dbo].[AsignacionTrabajador]([solicitudTrabajadorId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [AsignacionTrabajador_trabajadorId_idx] ON [dbo].[AsignacionTrabajador]([trabajadorId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Tarifa_cargoId_turnoId_vigenteDesde_idx] ON [dbo].[Tarifa]([cargoId], [turnoId], [vigenteDesde]);

-- CreateIndex
ALTER TABLE [dbo].[Contrato] ADD CONSTRAINT [Contrato_asignacionTrabajadorId_key] UNIQUE NONCLUSTERED ([asignacionTrabajadorId]);

-- AddForeignKey
ALTER TABLE [dbo].[SolicitudTrabajador] ADD CONSTRAINT [SolicitudTrabajador_tarifaId_fkey] FOREIGN KEY ([tarifaId]) REFERENCES [dbo].[Tarifa]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[SolicitudTrabajador] ADD CONSTRAINT [SolicitudTrabajador_solicitudId_fkey] FOREIGN KEY ([solicitudId]) REFERENCES [dbo].[Solicitud]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[AsignacionTrabajador] ADD CONSTRAINT [AsignacionTrabajador_solicitudTrabajadorId_fkey] FOREIGN KEY ([solicitudTrabajadorId]) REFERENCES [dbo].[SolicitudTrabajador]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[AsignacionTrabajador] ADD CONSTRAINT [AsignacionTrabajador_trabajadorId_fkey] FOREIGN KEY ([trabajadorId]) REFERENCES [dbo].[Trabajador]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[HistorialSolicitud] ADD CONSTRAINT [HistorialSolicitud_solicitudId_fkey] FOREIGN KEY ([solicitudId]) REFERENCES [dbo].[Solicitud]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[HistorialSolicitud] ADD CONSTRAINT [HistorialSolicitud_estadoId_fkey] FOREIGN KEY ([estadoId]) REFERENCES [dbo].[EstadoSolicitud]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[HistorialSolicitud] ADD CONSTRAINT [HistorialSolicitud_usuarioId_fkey] FOREIGN KEY ([usuarioId]) REFERENCES [dbo].[Usuario]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Contrato] ADD CONSTRAINT [Contrato_asignacionTrabajadorId_fkey] FOREIGN KEY ([asignacionTrabajadorId]) REFERENCES [dbo].[AsignacionTrabajador]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Tarifa] ADD CONSTRAINT [Tarifa_cargoId_fkey] FOREIGN KEY ([cargoId]) REFERENCES [dbo].[Cargo]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Tarifa] ADD CONSTRAINT [Tarifa_turnoId_fkey] FOREIGN KEY ([turnoId]) REFERENCES [dbo].[Turno]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
