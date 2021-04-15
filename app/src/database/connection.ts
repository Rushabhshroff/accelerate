import PouchDB from 'pouchdb'
import PouchDbFind from 'pouchdb-find'
import cordovaSqlitePlugin from 'pouchdb-adapter-cordova-sqlite';
import { isPlatform } from '@ionic/react';
import { Auth } from '../api';

export function connection<T>() {
    const token = Auth.token
    PouchDB.plugin(PouchDbFind);
    PouchDB.plugin(cordovaSqlitePlugin);
    return new PouchDB<T>(token?token.sub:'guest.db',{size:100});
}

export async function init_database() {
    console.log(JSON.stringify(await connection().info()))
    await connection().createIndex({ index: { fields: ['type'] } })
    await connection().createIndex({ index: { fields: ['name'] } })
    await connection().createIndex({ index: { fields: ['timestamp'] } })
    
}