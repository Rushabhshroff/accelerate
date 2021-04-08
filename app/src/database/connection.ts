import PouchDB from 'pouchdb'
import PouchDbFind from 'pouchdb-find'
import cordovaSqlitePlugin from 'pouchdb-adapter-cordova-sqlite';
import { isPlatform } from '@ionic/react';

export function connection<T>() {
    PouchDB.plugin(PouchDbFind);
    PouchDB.plugin(cordovaSqlitePlugin);
    if (!isPlatform('mobile') || isPlatform('mobileweb')) {
        return new PouchDB<T>('guest.db');
    } else {
        return new PouchDB<T>('guest.db', { adapter: 'cordova-sqlite' });
    }
}

export async function init_database() {
    await connection().createIndex({ index: { fields: ['type'] } })
    await connection().createIndex({ index: { fields: ['name'] } })
    await connection().createIndex({ index: { fields: ['timestamp'] } })
}