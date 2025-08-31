import bcrypt from 'bcrypt';


export const createHash = (plain) => bcrypt.hashSync(plain, bcrypt.genSaltSync(10));
export const isValidPassword = (plain, hashed) => bcrypt.compareSync(plain, hashed);