/* ASEGURARSE DE QUE TODAS LAS PASSWORD SEAN STRINGS.*/
import bcrypt from 'bcrypt';

const hashPass = async (password,salt = 8) => {
    const newHash = await bcrypt.hash(password, salt);
    return newHash;
}

const compareHash = async (password, hashToCompare) => {
    const isEqual = await bcrypt.compare(password, hashToCompare);
    return isEqual;
}

export {
    hashPass,
    compareHash
}