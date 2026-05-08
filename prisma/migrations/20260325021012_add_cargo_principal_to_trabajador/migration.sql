BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Trabajador] ADD [cargoPrincipalId] INT;

-- AddForeignKey
ALTER TABLE [dbo].[Trabajador] ADD CONSTRAINT [Trabajador_cargoPrincipalId_fkey] FOREIGN KEY ([cargoPrincipalId]) REFERENCES [dbo].[Cargo]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
