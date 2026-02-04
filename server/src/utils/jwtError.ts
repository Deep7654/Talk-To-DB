interface JwttError {
    message : string,
    name : string,
    code : number,
    expiredAt : Date
}

export default class jwtError extends Error implements JwttError {
    name : string;
    code : number;
    expiredAt : Date;
    constructor(message = "jwt error occured" , name : string , code : number , expiredAt : Date){
        super(message)
        this.name = name
        this.code = code
        this.expiredAt = expiredAt
    }
}