type ResponseCode<T> = {
    [k in keyof T]: string
}
function MakeCodes<T = unknown>(code: T) {
    let x: any = code;
    return x as ResponseCode<T> & { [Key: string]: string }
}
export const Codes = MakeCodes({
    "0000": "Success",
    "0011": "User already exists",
    "0404": "Item not found",
    "invalid-creds":"Invalid Email Address or Password",
    "no-auth": "Please provide authorization token",
    "invalid-jwt": "JWT token is not valid",
    "user-not-found": "User Not Found",
    "forbidden": "Access Forbidden" 
})