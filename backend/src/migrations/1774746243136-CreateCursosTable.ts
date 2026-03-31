import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from 'typeorm';

export class CreateCursosTable1774746243136 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Verificar si la tabla existe
    const tableExists = await queryRunner.hasTable('cursos');
    
    if (!tableExists) {
      // Crear tabla desde cero si no existe
      await queryRunner.createTable(
        new Table({
          name: 'cursos',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              generationStrategy: 'uuid',
              default: 'uuid_generate_v4()',
            },
            {
              name: 'codigo',
              type: 'varchar',
              length: '20',
              isNullable: false,
            },
            {
              name: 'nombre',
              type: 'varchar',
              length: '200',
              isNullable: false,
            },
            {
              name: 'descripcion',
              type: 'text',
              isNullable: true,
            },
            {
              name: 'carrera',
              type: 'varchar',
              length: '100',
              isNullable: false,
            },
            {
              name: 'nivel',
              type: 'enum',
              enum: ['pregrado', 'posgrado', 'diplomado'],
              default: "'pregrado'",
              isNullable: false,
            },
            {
              name: 'estado',
              type: 'enum',
              enum: ['activo', 'inactivo', 'en_planeacion'],
              default: "'activo'",
              isNullable: false,
            },
            {
              name: 'modalidad',
              type: 'enum',
              enum: ['presencial', 'virtual', 'hibrido'],
              default: "'presencial'",
              isNullable: false,
            },
            {
              name: 'creditos',
              type: 'int',
              isNullable: true,
            },
            {
              name: 'semestre',
              type: 'int',
              isNullable: true,
            },
            {
              name: 'cupos',
              type: 'int',
              default: 0,
              isNullable: true,
            },
            {
              name: 'profesorId',
              type: 'uuid',
              isNullable: true,
            },
            {
              name: 'programaId',
              type: 'uuid',
              isNullable: true,
            },
            {
              name: 'creadoEn',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP',
              isNullable: false,
            },
            {
              name: 'actualizadoEn',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP',
              isNullable: false,
            },
          ],
        }),
        true,
      );
    } else {
      // La tabla existe, agregar columnas faltantes
      const columns = await queryRunner.getTable('cursos');
      const existingColumns = columns?.columns.map(c => c.name) || [];

      // Agregar carrera si no existe
      if (!existingColumns.includes('carrera')) {
        await queryRunner.addColumn('cursos', new TableColumn({
          name: 'carrera',
          type: 'varchar',
          length: '100',
          isNullable: true,
        }));
      }

      // Agregar modalidad si no existe
      if (!existingColumns.includes('modalidad')) {
        await queryRunner.query(`CREATE TYPE modalidad_enum AS ENUM ('presencial', 'virtual', 'hibrido')`);
        await queryRunner.addColumn('cursos', new TableColumn({
          name: 'modalidad',
          type: 'modalidad_enum',
          default: "'presencial'",
          isNullable: false,
        }));
      }

      // Agregar cupos si no existe
      if (!existingColumns.includes('cupos')) {
        await queryRunner.addColumn('cursos', new TableColumn({
          name: 'cupos',
          type: 'int',
          default: 0,
          isNullable: true,
        }));
      }

      // Agregar programaId si no existe
      if (!existingColumns.includes('programaId')) {
        await queryRunner.addColumn('cursos', new TableColumn({
          name: 'programaId',
          type: 'uuid',
          isNullable: true,
        }));
      }

      // Agregar profesorId si no existe
      if (!existingColumns.includes('profesorId')) {
        await queryRunner.addColumn('cursos', new TableColumn({
          name: 'profesorId',
          type: 'uuid',
          isNullable: true,
        }));
      }
    }

    // Crear índices (solo si no existen, ignorar errores)
    try {
      await queryRunner.query(`CREATE INDEX "IDX_CURSOS_CARRERA" ON "cursos" ("carrera")`);
    } catch (e) { /* índice puede existir */ }
    
    try {
      await queryRunner.query(`CREATE INDEX "IDX_CURSOS_PROGRAMA_ID" ON "cursos" ("programaId")`);
    } catch (e) { /* índice puede existir */ }
    
    try {
      await queryRunner.query(`CREATE INDEX "IDX_CURSOS_MODALIDAD" ON "cursos" ("modalidad")`);
    } catch (e) { /* índice puede existir */ }

    // Agregar foreign key a programas si no existe
    try {
      await queryRunner.createForeignKey(
        'cursos',
        new TableForeignKey({
          columnNames: ['programaId'],
          referencedColumnNames: ['id'],
          referencedTableName: 'programas',
          onDelete: 'SET NULL',
          onUpdate: 'CASCADE',
        }),
      );
    } catch (e) { /* FK puede existir */ }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tableExists = await queryRunner.hasTable('cursos');
    if (tableExists) {
      await queryRunner.dropTable('cursos');
    }
  }
}
