import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAsesoramientosTable1743300000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Crear el enum para estado de asesoramiento
    await queryRunner.query(`
      CREATE TYPE "estado_asesoramiento_enum" AS ENUM ('pendiente', 'respondido', 'cerrado')
    `);

    // Crear la tabla asesoramientos
    await queryRunner.query(`
      CREATE TABLE asesoramientos (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        nombres varchar(100) NOT NULL,
        apellidos varchar(100) NOT NULL,
        email varchar(255) NOT NULL,
        telefono varchar(50) NOT NULL,
        pais varchar(100) NOT NULL,
        ciudad varchar(100) NOT NULL,
        modalidad varchar(50) NOT NULL,
        programa varchar(200) NOT NULL,
        estado "estado_asesoramiento_enum" NOT NULL DEFAULT 'pendiente',
        respuesta text,
        "respondidoEn" timestamp,
        "creadoEn" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "actualizadoEn" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Crear índices
    await queryRunner.query(`CREATE INDEX "IDX_ASESORAMIENTO_ESTADO" ON asesoramientos (estado)`);
    await queryRunner.query(`CREATE INDEX "IDX_ASESORAMIENTO_CREADO_EN" ON asesoramientos ("creadoEn")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS asesoramientos CASCADE`);
    await queryRunner.query(`DROP TYPE IF EXISTS "estado_asesoramiento_enum" CASCADE`);
  }
}
