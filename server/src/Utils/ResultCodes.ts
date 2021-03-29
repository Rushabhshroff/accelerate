declare type ResponseCode<T> = {
    [k in keyof T]: string;
};
export declare const Codes: ResponseCode<{
    "0000": string;
    "0011": string;
    "0012": string;
    "0404": string;
    "no-auth": string;
    "invalid-jwt": string;
    "user-not-found": string;
    forbidden: string;
}> & {
    [Key: string]: string;
};
export {};