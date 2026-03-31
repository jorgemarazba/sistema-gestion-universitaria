import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixCursosTable1743300000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Eliminar foreign keys si existen
    await queryRunner.query(`ALTER TABLE IF EXISTS inscripciones DROP CONSTRAINT IF EXISTS fk_inscripciones_curso`);
    await queryRunner.query(`ALTER TABLE IF EXISTS cursos DROP CONSTRAINT IF EXISTS "FK_CURSOS_PROGRAMA"`);
    await queryRunner.query(`ALTER TABLE IF EXISTS cursos DROP CONSTRAINT IF EXISTS "FK_CURSOS_PROFESOR"`);

    // Eliminar la tabla cursos
    await queryRunner.query(`DROP TABLE IF EXISTS cursos CASCADE`);

    // Recrear la tabla con la estructura correcta
    await queryRunner.query(`
      CREATE TABLE cursos (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        codigo varchar(20) NOT NULL UNIQUE,
        nombre varchar(200) NOT NULL,
        descripcion text,
        carrera varchar(100) NOT NULL,
        nivel varchar(20) NOT NULL DEFAULT 'pregrado',
        estado varchar(20) NOT NULL DEFAULT 'activo',
        modalidad varchar(20) NOT NULL DEFAULT 'presencial',
        creditos integer,
        semestre integer,
        cupos integer DEFAULT 0,
        profesor_id uuid,
        programa_id uuid,
        creado_en timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        actualizado_en timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Crear índices
    await queryRunner.query(`CREATE INDEX "IDX_CURSOS_CARRERA" ON cursos (carrera)`);
    await queryRunner.query(`CREATE INDEX "IDX_CURSOS_PROGRAMA_ID" ON cursos (programa_id)`);
    await queryRunner.query(`CREATE INDEX "IDX_CURSOS_MODALIDAD" ON cursos (modalidad)`);

    // Foreign key a programas
    await queryRunner.query(`
      ALTER TABLE cursos 
      ADD CONSTRAINT "FK_CURSOS_PROGRAMA" 
      FOREIGN KEY (programa_id) REFERENCES programas(id) ON DELETE SET NULL ON UPDATE CASCADE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS cursos CASCADE`);
  }
}
