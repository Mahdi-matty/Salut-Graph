  const { v4: uuidv4 } = require('uuid');
const params = (fileName) => {
    const myFile = fileName.originalname.split('.');
    const fileType = myFile[myFile.length - 1];
  
    const imageParams = {
      // Replace the <My_Bucket_Name> with the name of your own S3 bucket
      Bucket: 'user-images-669af664-23f0-47fd-bd77-2745b6a066b7',
      Key: `${uuidv4()}.${fileType}`,
      Body: fileName.buffer,
      ACL: 'private',
    };
  
    return imageParams;
  };
    module.exports = params