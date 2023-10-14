import { useState } from "react";
import { usePresignedUpload } from "next-s3-upload";

export default function UploadComponent() {
    let [imageUrl, setImageUrl] = useState<string>();
    let { FileInput, openFileDialog, uploadToS3 } = usePresignedUpload();
    
    let handleFileChange = async (file : File) => {
      let { url } = await uploadToS3(file);
      setImageUrl(url);
    };
  
    return (
      <>
        <FileInput onChange={handleFileChange} />
        {imageUrl && <img src={imageUrl} />}
      </>
    );
  }