import PouchDB from 'pouchdb'
import PouchDbFind from 'pouchdb-find'
import cordovaSqlitePlugin from 'pouchdb-adapter-cordova-sqlite';
import { isPlatform } from '@ionic/react';
export default function Database<T>() {
    PouchDB.plugin(PouchDbFind);
    PouchDB.plugin(cordovaSqlitePlugin);
    if (!isPlatform('mobile') || isPlatform('mobileweb')) {
        return new PouchDB<T>('exercises.db');
    } else {
        return new PouchDB<T>('exercises.db', { adapter: 'cordova-sqlite' });
    }
}

export async function InitDatabase() {
    
    await Database().createIndex({ index: { fields: ['type'] } })
    await Database().createIndex({ index: { fields: ['name'] } })
    await Database().createIndex({ index: { fields: ['timestamp'] } })
    
}