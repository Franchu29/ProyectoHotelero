/*
  Warnings:

  - You are about to drop the column `fecha` on the `Solicitud` table. All the data in the column will be lost.
  - You are about to drop the column `areaId` on the `SolicitudTrabajador` table. All the data in the column will be lost.
  - You are about to alter the column `inicio` on the `Turno` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(1000)` to `Time`.
  - You are about to alter the column `fin` on the `Turno` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(1000)` to `Time`.
  - A unique constraint covering the columns `[nombre]` on the table `Afiliacion` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nombre]` on the table `Area` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nombre,areaId]` on the table `Cargo` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nombre,regionId]` on the table `Comuna` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[rut]` on the table `Empresa` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nombre]` on the table `EstadoCivil` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nombre]` on the table `EstadoSolicitud` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nombre]` on the table `Pais` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nombre]` on the table `PrevisionSalud` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nombre]` on the table `Region` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[rut]` on the table `RepLegal` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nombre]` on the table `Rol` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[solicitudId,trabajadorId]` on the table `SolicitudTrabajador` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[rut]` on the table `Trabajador` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[inicio,fin]` on the table `Turno` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `areaId` to the `Cargo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fechaFin` to the `Solicitud` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fechaInicio` to the `Solicitud` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[SolicitudTrabajador] DROP CONSTRAINT [SolicitudTrabajador_areaId_fkey];

-- AlterTable
ALTER TABLE [dbo].[Cargo] ADD [areaId] INT NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[Solicitud] DROP COLUMN [fecha];
ALTER TABLE [dbo].[Solicitud] ADD [fechaFin] DATETIME2 NOT NULL,
[fechaInicio] DATETIME2 NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[SolicitudTrabajador] DROP COLUMN [areaId];

-- AlterTable
ALTER TABLE [dbo].[Turno] ALTER COLUMN [inicio] TIME NOT NULL;
ALTER TABLE [dbo].[Turno] ALTER COLUMN [fin] TIME NOT NULL;

-- CreateIndex
ALTER TABLE [dbo].[Afiliacion] ADD CONSTRAINT [Afiliacion_nombre_key] UNIQUE NONCLUSTERED ([nombre]);

-- CreateIndex
ALTER TABLE [dbo].[Area] ADD CONSTRAINT [Area_nombre_key] UNIQUE NONCLUSTERED ([nombre]);

-- CreateIndex
ALTER TABLE [dbo].[Cargo] ADD CONSTRAINT [Cargo_nombre_areaId_key] UNIQUE NONCLUSTERED ([nombre], [areaId]);

-- CreateIndex
ALTER TABLE [dbo].[Comuna] ADD CONSTRAINT [Comuna_nombre_regionId_key] UNIQUE NONCLUSTERED ([nombre], [regionId]);

-- CreateIndex
ALTER TABLE [dbo].[Empresa] ADD CONSTRAINT [Empresa_rut_key] UNIQUE NONCLUSTERED ([rut]);

-- CreateIndex
ALTER TABLE [dbo].[EstadoCivil] ADD CONSTRAINT [EstadoCivil_nombre_key] UNIQUE NONCLUSTERED ([nombre]);

-- CreateIndex
ALTER TABLE [dbo].[EstadoSolicitud] ADD CONSTRAINT [EstadoSolicitud_nombre_key] UNIQUE NONCLUSTERED ([nombre]);

-- CreateIndex
ALTER TABLE [dbo].[Pais] ADD CONSTRAINT [Pais_nombre_key] UNIQUE NONCLUSTERED ([nombre]);

-- CreateIndex
ALTER TABLE [dbo].[PrevisionSalud] ADD CONSTRAINT [PrevisionSalud_nombre_key] UNIQUE NONCLUSTERED ([nombre]);

-- CreateIndex
ALTER TABLE [dbo].[Region] ADD CONSTRAINT [Region_nombre_key] UNIQUE NONCLUSTERED ([nombre]);

-- CreateIndex
ALTER TABLE [dbo].[RepLegal] ADD CONSTRAINT [RepLegal_rut_key] UNIQUE NONCLUSTERED ([rut]);

-- CreateIndex
ALTER TABLE [dbo].[Rol] ADD CONSTRAINT [Rol_nombre_key] UNIQUE NONCLUSTERED ([nombre]);

-- CreateIndex
ALTER TABLE [dbo].[SolicitudTrabajador] ADD CONSTRAINT [SolicitudTrabajador_solicitudId_trabajadorId_key] UNIQUE NONCLUSTERED ([solicitudId], [trabajadorId]);

-- CreateIndex
ALTER TABLE [dbo].[Trabajador] ADD CONSTRAINT [Trabajador_rut_key] UNIQUE NONCLUSTERED ([rut]);

-- CreateIndex
ALTER TABLE [dbo].[Turno] ADD CONSTRAINT [Turno_inicio_fin_key] UNIQUE NONCLUSTERED ([inicio], [fin]);

-- CreateIndex
ALTER TABLE [dbo].[Usuario] ADD CONSTRAINT [Usuario_email_key] UNIQUE NONCLUSTERED ([email]);

-- AddForeignKey
ALTER TABLE [dbo].[Cargo] ADD CONSTRAINT [Cargo_areaId_fkey] FOREIGN KEY ([areaId]) REFERENCES [dbo].[Area]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
