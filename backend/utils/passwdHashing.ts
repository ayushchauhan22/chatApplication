import bcrypt from "bcrypt"

export const  hashPswd = async(password : string) => {
    return await bcrypt.hash(password, 12);
}

export const verifyPswd = async(password : string, hashPswd : string) => {
    return await bcrypt.compare(password, hashPswd);
}