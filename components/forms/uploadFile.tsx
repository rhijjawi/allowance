"use client";

import { Bold, Italic, Text } from "@tremor/react";
import { useRef, useState } from "react";
import axios from "axios";
import { usePresignedUpload, useS3Upload } from "next-s3-upload";
import { getSupabase } from "@/utils/supabase";
import { useAuth, useUser } from "@clerk/nextjs";
export function DragAndDrop(props: {id : number, user : any}) {
  let { uploadToS3 } = usePresignedUpload();
  const [dragActive, setDragActive] = useState<boolean>(false);
  const inputRef = useRef<any>(null);
  const [filesArr, setFilesArr] = useState<any>([]);
  const [fileKeys, setFileKeys] = useState<any>([]);
  const {user, isLoaded, isSignedIn} = useUser();
  const {getToken} = useAuth()
  function handleChange(e: any) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      console.log(e.target.files);
      for (let i = 0; i < e.target.files["length"]; i++) {
        setFilesArr((prevState: any) => [...prevState, e.target.files[i]]);
      }
    }
  }

  async function handleSubmitFile(e: any) {
    let fileKeys: any = []
    if (filesArr.length === 0) {
      return;
    } else {
      for (let i = 0; i < filesArr.length; i++) {        
        const {url, key} = await uploadToS3(filesArr[i])
        fileKeys = [...fileKeys, key]
        if (url){await axios.get(`/api/generate-temporary-url?key=${key}`)}
      }
      let {data, error} = await (await getSupabase(await getToken({template: "supabase"}))).from('expenses').update({files: fileKeys}).eq('id', props.id).select()
      console.log(data, error)
    }
  }

  function handleDrop(e: any) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      for (let i = 0; i < e.dataTransfer.files["length"]; i++) {
        setFilesArr((prevState: any) => [...prevState, e.dataTransfer.files[i]]);
      }
    }
  }

  function handleDragLeave(e: any) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }

  function handleDragOver(e: any) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }

  function handleDragEnter(e: any) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }

  function removeFile(fileName: any, idx: any) {
    const newArr = [...filesArr];
    newArr.splice(idx, 1);
    setFilesArr([]);
    setFilesArr(newArr);
  }

  function openFileExplorer() {
    inputRef.current.value = "";
    inputRef.current.click();
  }

  return (
    <>
      <form
        className={`${
          dragActive ? "bg-blue-400" : "bg-blue-100"
        }  p-4 mb-12 w-full rounded-lg min-h-24 text-center items-center justify-center`}
        onDragEnter={handleDragEnter}
        onSubmit={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
      >
        <input
          placeholder="fileInput"
          className="hidden"
          ref={inputRef}
          type="file"
          multiple={true}
          onChange={handleChange}
          accept=".xlsx,.xls,image/*,.doc, .docx,.ppt, .pptx,.txt,.pdf"
        />

        <Bold>Drag & Drop files</Bold><br/>
        <Italic>or</Italic><br/>
          <span
            className="font-bold text-blue-600 cursor-pointer"
            onClick={openFileExplorer}
          >
            <u>Select files</u>
          </span>{" "}
          to upload
        

        <div className="flex flex-col items-center p-3">
          {filesArr.map((file: any, index: any) => (
            <div key={index} className="flex flex-row space-x-5">
              <Text>{file.name}</Text>
              <Text>{file.progress}</Text>

              <span
                className="text-red-500 cursor-pointer"
                onClick={() => removeFile(file.name, index)}
              >
                remove
              </span>
            </div>
          ))}
        </div>

      <div className="relative h-fit my-5 bottom-0 translate-y-4">
        <button disabled={filesArr.length == 0} className="bg-black disabled:bg-black/60 border-2 border-green-400 disabled:border-red-400 disabled:cursor-not-allowed  h-fit rounded-lg p-2 mt-3 w-auto absolute mx-auto right-0 left-0 bottom-0 top-0" onClick={handleSubmitFile}>
          <span className="p-2 text-white">Submit</span>
        </button>
      </div>
      </form>
      
    </>
  );
}