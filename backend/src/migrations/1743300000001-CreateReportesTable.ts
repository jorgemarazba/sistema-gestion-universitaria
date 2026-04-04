import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateReportesTable1743300000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Crear el enum para tipo de reporte
    await queryRunner.query(`
      CREATE TYPE "tipo_reporte_enum" AS ENUM ('academico', 'financiero', 'usuarios', 'cursos', 'general')
    `);

    // Crear el enum para estado de reporte
    await queryRunner.query(`
      CREATE TYPE "estado_reporte_enum" AS ENUM ('pendiente', 'en_proceso', 'completado', 'error')
    `);

    // Crear la tabla reportes
    await queryRunner.query(`
      CREATE TABLE reportes (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        titulo varchar(255) NOT NULL,
        descripcion text,
        tipo "tipo_reporte_enum" NOT NULL,
        estado "estado_reporte_enum" NOT NULL DEFAULT 'pendiente',
        filtros json,
        resultado text,
        "creadoPor" varchar(100),
        "creadoEn" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Crear índice en tipo
    await queryRunner.query(`CREATE INDEX "IDX_REPORTES_TIPO" ON reportes (tipo)`);
    
    // Crear índice en estado
    await queryRunner.query(`CREATE INDEX "IDX_REPORTES_ESTADO" ON reportes (estado)`);
    
    // Crear índice en fecha de creación
    await queryRunner.query(`CREATE INDEX "IDX_REPORTES_CREADO_EN" ON reportes ("creadoEn")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS reportes CASCADE`);
    await queryRunner.query(`DROP TYPE IF EXISTS "tipo_reporte_enum" CASCADE`);
    await queryRunner.query(`DROP TYPE IF EXISTS "estado_reporte_enum" CASCADE`);
  }
}
