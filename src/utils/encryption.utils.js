import crypto from 'node:crypto';
import fs from 'node:fs'

const IV_LENGTH=process.env.IV_LENGTH;
const ENCRYPTION_SECRET_KEY=Buffer.from(process.env.ENCRYPTION_SECRET_KEY);

//Symmetric

//Data  Encryption
export const encrypt=(text)=>{
   try{
     const iv=crypto.randomBytes(IV_LENGTH);
    const cipher=crypto.createCipheriv('aes-256-cbc',ENCRYPTION_SECRET_KEY,iv);
    let encryptedData=cipher.update(text,'utf-8','hex');
    encryptedData+=cipher.final('hex');
    return `${iv.toString('hex')}:${encryptedData}`
   }catch(err){
    console.log('internal server error',err);
   }
};
//Data DecryptIon
export const decrypt=(encryptedData)=>{
  try{
      const [iv,encryptedText]=encryptedData.split(':');
    const binaryLikeIv=Buffer.from(iv,'hex');
    const decipher=crypto.createDecipheriv('aes-256-cbc',ENCRYPTION_SECRET_KEY,binaryLikeIv);
    let decryptedData=decipher.update(encryptedText,'hex','utf8');
    decryptedData+=decipher.final('utf8')
    return decryptedData;
  }catch(err){
    console.log("internal server error",err);
    
  }

}
//Asymmetric
if(fs.existsSync('publicKey.pem')&&fs.existsSync('privateKey.pem')){
    console.log('Key already generated');
    
    

}else{
    const{publicKey, privateKey }=crypto.generateKeyPairSync('rsa',{
    modulusLength:2084,
    publicKeyEncoding:{
        type:'pkcs1',
        format:'pem'
    },
    privateKeyEncoding:{
         type:'pkcs1',
        format:'pem'

    }
});

fs.writeFileSync('publicKey.pem',publicKey)
fs.writeFileSync('privateKey.pem',privateKey)

}
 //Encryption 
export const encryptAsymmetric=(text)=>{
    const publicKey=fs.readFileSync('publicKey.pem','utf8')
    const bufferText=Buffer.from(text);
    const encrypted=crypto.publicEncrypt({
        key:publicKey,
        padding:crypto.constants.RSA_PKCS1_OAEP_PADDING
    },bufferText);
    return encrypted.toString('hex')

}
//Dcryption
export const decryptAsymmetric=(encryptedData)=>{
    const privateKey=fs.readFileSync('privateKey.pem');
    const bufferHex=Buffer.from(encryptedData,'hex');
    const decrypted=crypto.privateDecrypt({
        key:privateKey,
        padding:crypto.constants.RSA_PKCS1_OAEP_PADDING
    },
    bufferHex
);
return decrypted.toString('utf8');
}
