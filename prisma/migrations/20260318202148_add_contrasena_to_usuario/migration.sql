BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Usuario] (
    [id] INT NOT NULL IDENTITY(1,1),
    [nombre] NVARCHAR(1000),
    [email] NVARCHAR(1000),
    [contrasena] NVARCHAR(1000),
    [rolId] INT NOT NULL,
    CONSTRAINT [Usuario_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Rol] (
    [id] INT NOT NULL IDENTITY(1,1),
    [nombre] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Rol_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Pais] (
    [id] INT NOT NULL IDENTITY(1,1),
    [nombre] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Pais_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Region] (
    [id] INT NOT NULL IDENTITY(1,1),
    [nombre] NVARCHAR(1000) NOT NULL,
    [paisId] INT NOT NULL,
    CONSTRAINT [Region_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Comuna] (
    [id] INT NOT NULL IDENTITY(1,1),
    [nombre] NVARCHAR(1000) NOT NULL,
    [regionId] INT NOT NULL,
    CONSTRAINT [Comuna_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Empresa] (
    [id] INT NOT NULL IDENTITY(1,1),
    [nombre] NVARCHAR(1000) NOT NULL,
    [rut] NVARCHAR(1000) NOT NULL,
    [direccion] NVARCHAR(1000) NOT NULL,
    [comunaId] INT NOT NULL,
    [representanteLegalId] INT NOT NULL,
    CONSTRAINT [Empresa_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[RepLegal] (
    [id] INT NOT NULL IDENTITY(1,1),
    [nombres] NVARCHAR(1000) NOT NULL,
    [apellidos] NVARCHAR(1000) NOT NULL,
    [rut] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [RepLegal_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Trabajador] (
    [id] INT NOT NULL IDENTITY(1,1),
    [nombres] NVARCHAR(1000) NOT NULL,
    [apellidos] NVARCHAR(1000) NOT NULL,
    [rut] NVARCHAR(1000) NOT NULL,
    [direccion] NVARCHAR(1000) NOT NULL,
    [fechaNacimiento] DATETIME2 NOT NULL,
    [comunaId] INT NOT NULL,
    [estadoCivilId] INT NOT NULL,
    [previsionId] INT NOT NULL,
    [afiliacionId] INT NOT NULL,
    CONSTRAINT [Trabajador_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Solicitud] (
    [id] INT NOT NULL IDENTITY(1,1),
    [fecha] DATETIME2 NOT NULL,
    [comentario] NVARCHAR(1000),
    [montoTotal] FLOAT(53),
    [estadoId] INT NOT NULL,
    [creadorId] INT NOT NULL,
    [aprobadorId] INT,
    [empresaId] INT NOT NULL,
    CONSTRAINT [Solicitud_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[SolicitudTrabajador] (
    [id] INT NOT NULL IDENTITY(1,1),
    [solicitudId] INT NOT NULL,
    [trabajadorId] INT NOT NULL,
    [cargoId] INT NOT NULL,
    [turnoId] INT NOT NULL,
    [areaId] INT NOT NULL,
    [monto] FLOAT(53) NOT NULL,
    CONSTRAINT [SolicitudTrabajador_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Contrato] (
    [id] INT NOT NULL IDENTITY(1,1),
    [fechaInicio] DATETIME2 NOT NULL,
    [fechaFin] DATETIME2 NOT NULL,
    [monto] FLOAT(53) NOT NULL,
    [solicitudId] INT NOT NULL,
    [trabajadorId] INT NOT NULL,
    [solicitudTrabajadorId] INT NOT NULL,
    CONSTRAINT [Contrato_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Contrato_solicitudTrabajadorId_key] UNIQUE NONCLUSTERED ([solicitudTrabajadorId])
);

-- CreateTable
CREATE TABLE [dbo].[EstadoSolicitud] (
    [id] INT NOT NULL IDENTITY(1,1),
    [nombre] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [EstadoSolicitud_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[EstadoCivil] (
    [id] INT NOT NULL IDENTITY(1,1),
    [nombre] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [EstadoCivil_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[PrevisionSalud] (
    [id] INT NOT NULL IDENTITY(1,1),
    [nombre] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [PrevisionSalud_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Afiliacion] (
    [id] INT NOT NULL IDENTITY(1,1),
    [nombre] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Afiliacion_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Cargo] (
    [id] INT NOT NULL IDENTITY(1,1),
    [nombre] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Cargo_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Turno] (
    [id] INT NOT NULL IDENTITY(1,1),
    [inicio] NVARCHAR(1000) NOT NULL,
    [fin] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Turno_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Area] (
    [id] INT NOT NULL IDENTITY(1,1),
    [nombre] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Area_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Notificacion] (
    [id] INT NOT NULL IDENTITY(1,1),
    [usuarioId] INT NOT NULL,
    [fecha] DATETIME2,
    [contenido] NVARCHAR(1000),
    CONSTRAINT [Notificacion_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Usuario] ADD CONSTRAINT [Usuario_rolId_fkey] FOREIGN KEY ([rolId]) REFERENCES [dbo].[Rol]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Region] ADD CONSTRAINT [Region_paisId_fkey] FOREIGN KEY ([paisId]) REFERENCES [dbo].[Pais]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Comuna] ADD CONSTRAINT [Comuna_regionId_fkey] FOREIGN KEY ([regionId]) REFERENCES [dbo].[Region]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Empresa] ADD CONSTRAINT [Empresa_comunaId_fkey] FOREIGN KEY ([comunaId]) REFERENCES [dbo].[Comuna]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Empresa] ADD CONSTRAINT [Empresa_representanteLegalId_fkey] FOREIGN KEY ([representanteLegalId]) REFERENCES [dbo].[RepLegal]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Trabajador] ADD CONSTRAINT [Trabajador_comunaId_fkey] FOREIGN KEY ([comunaId]) REFERENCES [dbo].[Comuna]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Trabajador] ADD CONSTRAINT [Trabajador_estadoCivilId_fkey] FOREIGN KEY ([estadoCivilId]) REFERENCES [dbo].[EstadoCivil]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Trabajador] ADD CONSTRAINT [Trabajador_previsionId_fkey] FOREIGN KEY ([previsionId]) REFERENCES [dbo].[PrevisionSalud]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Trabajador] ADD CONSTRAINT [Trabajador_afiliacionId_fkey] FOREIGN KEY ([afiliacionId]) REFERENCES [dbo].[Afiliacion]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Solicitud] ADD CONSTRAINT [Solicitud_estadoId_fkey] FOREIGN KEY ([estadoId]) REFERENCES [dbo].[EstadoSolicitud]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Solicitud] ADD CONSTRAINT [Solicitud_creadorId_fkey] FOREIGN KEY ([creadorId]) REFERENCES [dbo].[Usuario]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Solicitud] ADD CONSTRAINT [Solicitud_aprobadorId_fkey] FOREIGN KEY ([aprobadorId]) REFERENCES [dbo].[Usuario]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Solicitud] ADD CONSTRAINT [Solicitud_empresaId_fkey] FOREIGN KEY ([empresaId]) REFERENCES [dbo].[Empresa]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[SolicitudTrabajador] ADD CONSTRAINT [SolicitudTrabajador_solicitudId_fkey] FOREIGN KEY ([solicitudId]) REFERENCES [dbo].[Solicitud]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[SolicitudTrabajador] ADD CONSTRAINT [SolicitudTrabajador_trabajadorId_fkey] FOREIGN KEY ([trabajadorId]) REFERENCES [dbo].[Trabajador]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[SolicitudTrabajador] ADD CONSTRAINT [SolicitudTrabajador_cargoId_fkey] FOREIGN KEY ([cargoId]) REFERENCES [dbo].[Cargo]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[SolicitudTrabajador] ADD CONSTRAINT [SolicitudTrabajador_turnoId_fkey] FOREIGN KEY ([turnoId]) REFERENCES [dbo].[Turno]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[SolicitudTrabajador] ADD CONSTRAINT [SolicitudTrabajador_areaId_fkey] FOREIGN KEY ([areaId]) REFERENCES [dbo].[Area]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Contrato] ADD CONSTRAINT [Contrato_solicitudId_fkey] FOREIGN KEY ([solicitudId]) REFERENCES [dbo].[Solicitud]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Contrato] ADD CONSTRAINT [Contrato_trabajadorId_fkey] FOREIGN KEY ([trabajadorId]) REFERENCES [dbo].[Trabajador]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Contrato] ADD CONSTRAINT [Contrato_solicitudTrabajadorId_fkey] FOREIGN KEY ([solicitudTrabajadorId]) REFERENCES [dbo].[SolicitudTrabajador]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Notificacion] ADD CONSTRAINT [Notificacion_usuarioId_fkey] FOREIGN KEY ([usuarioId]) REFERENCES [dbo].[Usuario]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
