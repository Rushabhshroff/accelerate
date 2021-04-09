export function RequestFilter(fields: string[]) {
    return function(req: any, res: any, next: any){
        for (let field of fields) {
            delete req.body[field]
        }
        next()
    }
}