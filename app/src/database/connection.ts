import PouchDB from 'pouchdb'
import PouchDbFind from 'pouchdb-find'
import cordovaSqlitePlugin from 'pouchdb-adapter-cordova-sqlite';
import { isPlatform } from '@ionic/react';
import { Auth } from '../api';

export function connection<T>() {
    const token = Auth.token
    PouchDB.plugin(PouchDbFind);
    PouchDB.plugin(cordovaSqlitePlugin);
    if (!isPlatform('mobile') || isPlatform('mobileweb')) {
        return new PouchDB<T>(token?token.sub:'guest.db');
    } else {
        return new PouchDB<T>(token?token.sub:'guest.db', { adapter: 'cordova-sqlite' });
    }
}

export async function init_database() {
    await connection().createIndex({ index: { fields: ['type'] } })
    await connection().createIndex({ index: { fields: ['name'] } })
    await connection().createIndex({ index: { fields: ['timestamp'] } })
    console.log(await connection().info())
}