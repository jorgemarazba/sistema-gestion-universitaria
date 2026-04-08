import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddProgramaIdToUsuarios1743918420000 implements MigrationInterface {
  name = 'AddProgramaIdToUsuarios1743918420000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Verificar si la columna ya existe
    const hasColumn = await queryRunner.hasColumn('usuarios', 'programa_id');
    
    if (!hasColumn) {
      await queryRunner.addColumn(
        'usuarios',
        new TableColumn({
          name: 'programa_id',
          type: 'uuid',
          isNullable: true,
        }),
      );
      console.log('✅ Columna programa_id agregada a usuarios');
    } else {
      console.log('ℹ️ La columna programa_id ya existe, ignorando migración');
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('usuarios', 'programa_id');
  }
}
