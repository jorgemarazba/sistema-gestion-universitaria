import { MigrationInterface, QueryRunner } from "typeorm";

export class FixProgramasTable1774746243135 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Eliminar constraints de otras tablas primero
        await queryRunner.query(`ALTER TABLE IF EXISTS "cursos" DROP CONSTRAINT IF EXISTS "cursos_id_programa_fkey"`);
        await queryRunner.query(`ALTER TABLE IF EXISTS "matriculas" DROP CONSTRAINT IF EXISTS "matriculas_id_programa_fkey"`);
        
        // Eliminar tabla si existe
        await queryRunner.query(`DROP TABLE IF EXISTS "programas"`);
        
        // Crear tabla con estructura correcta
        await queryRunner.query(`
            CREATE TABLE "programas" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "codigo" character varying NOT NULL,
                "nombre" character varying NOT NULL,
                "descripcion" character varying,
                "semestres" integer NOT NULL DEFAULT 10,
                "cursos" integer NOT NULL DEFAULT 0,
                "estudiantes" integer NOT NULL DEFAULT 0,
                "estado" character varying NOT NULL DEFAULT 'activo',
                "nivel" character varying NOT NULL DEFAULT 'pregrado',
                "creditosTotales" integer,
                "coordinadorId" character varying,
                "creadoEn" TIMESTAMP NOT NULL DEFAULT now(),
                "actualizadoEn" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_programas" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "programas"`);
    }

}
