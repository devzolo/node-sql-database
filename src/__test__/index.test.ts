import path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env.test') });
import { SQLiteDatabase } from '../driver/sqlite';

describe('Example Test', () => {
  it('sqlite test', async () => {
    const db = new SQLiteDatabase();
    db.setDatabase('./teste.db');
    db.setOptions({ verbose: console.log });
    await db.init();

    db.connect((err: any, db: SQLiteDatabase) => {
      if (err) {
        console.error('connect error = ', err);
        return;
      }

      db.transaction(
        async t => {
          if (false)
            await t.executeSql(
              `
          CREATE TABLE COMPANY(
            ID INT PRIMARY KEY     NOT NULL,
            NAME           TEXT    NOT NULL,
            AGE            INT     NOT NULL,
            ADDRESS        CHAR(50),
            SALARY         REAL
          );
        `,
              [],
              (t, rs) => {
                console.log('CREATE TABLE = OK');
              },
              (t, e) => {
                console.error('CREATE TABLE = FAIL => ', e);
              },
            );

          if (false)
            await t.executeSql(
              `INSERT INTO COMPANY VALUES (:ID , :NAME , :AGE , :ADDRESS , :SALARY )`,
              [3, 'Smith3', 45, 'TESTE3', 467.0],
              (t, rs) => {
                console.log('INSERT = OK');
              },
              (t, e) => {
                console.error('INSERT = FAIL => ', e);
              },
            );

          await t.executeSql(
            'SELECT * FROM COMPANY',
            [],
            (t, rs) => {
              console.log(rs?.rows?.length);

              for (const row of rs?.rows || []) {
                console.log('ID =', row?.id, 'NAME =', row?.name);
              }
            },
            (t, e) => {
              console.error(e);
            },
          );
        },
        e => {
          console.error(e);
        },
        () => {
          console.log('OK');
        },
      );
    });
    expect('ok').toBe('ok');
  });
});
