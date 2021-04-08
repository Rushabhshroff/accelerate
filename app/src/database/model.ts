import { connection as Database } from "./connection"
import { v1 } from 'uuid'
import { Document } from "./document"
function model<T extends Document = any, X = unknown>(type: string) {
    interface IModel {
        new(obj?: T, forceId?: boolean): Model & T
        find(request: PouchDB.Find.FindRequest<T>): Promise<PouchDB.Find.FindResponse<T>>,
        findById(id: string, options?: PouchDB.Core.GetOptions): Promise<T & PouchDB.Core.IdMeta & PouchDB.Core.GetMeta>
        create(obj: T): Promise<Model & T>,
        getAll(): Promise<PouchDB.Find.FindResponse<T>>,
        clone(ob: Model & T):Model & T
    }
    let db = Database<T>()
    class Model {
        _id!: string
        _rev!: string
        _deleted!: boolean
        type: string
        constructor(obj?: T, forceId?: boolean) {
            this.type = type
            this._id = v1()
            if (obj) {
                return Object.assign(this, obj)
            }
            if (forceId) {
                this._id = v1();
            }
        }
        static find(request: PouchDB.Find.FindRequest<T>) {
            request.selector.type = type
            return db.find(request).then((res) => {
                return res
            })
        }
        static findById(id: string, options?: PouchDB.Core.GetOptions) {
            return db.get(id);
        }
        async save() {
            let res = await db.put<this & T>(this as this & T)
            this._rev = res.rev
        }
        static async create(obj: T) {
            let res = await db.post(obj as Model & T);
            let ob = new Model(obj);
            ob._rev = res.rev;
            ob._id = res.id;
            return ob as Model & T
        }
        static getAll() {
            return this.find({ selector: {} })
        }
        static clone(ob: Model & T) {
            let n = Object.assign({}, ob) as any
            delete n._id; delete n._rev; delete n._deleted;
            return new Model(n) as Model & T;
        }
        delete() {
            this._deleted = true;
            return this.save();
        }
    }
    //@ts-ignore
    return Model as Model & X & IModel
}

export default model;

