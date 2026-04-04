import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddArchivosToAsesoramiento1743300000003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'asesoramientos',
      new TableColumn({
        name: 'archivos',
        type: 'text',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('asesoramiento', 'archivos');
  }
}
