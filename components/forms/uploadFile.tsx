"use client";

import { Bold, Italic, Text } from "@tremor/react";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { usePresignedUpload, useS3Upload } from "next-s3-upload";
import {generateTemporaryUrl} from "@/utils/functions/s3"
import { getSupabase } from "@/utils/supabase";
import { useAuth, useUser } from "@clerk/nextjs";
import { ExpenseType } from "../contexts/expenseCTX";
import { useAlerts } from "../contexts/alertHandler";
import Link from "next/link";
import { FolderOpenIcon } from "@heroicons/react/24/outline";
export function DragAndDrop(props: {id : number, user : any, exp : ExpenseType, setOpen : React.Dispatch<React.SetStateAction<boolean>>}) {
  let { uploadToS3, files } = usePresignedUpload();
  const [dragActive, setDragActive] = useState<boolean>(false);
  const inputRef = useRef<any>(null);
  const [filesArr, setFilesArr] = useState<any>([]);
  const [fileKeys, setFileKeys] = useState<any>([]);
  const {user, isLoaded, isSignedIn} = useUser();
  const {getToken} = useAuth()
  const {addAlert} = useAlerts()
  const [fileURLs, setFileURLs] = useState<{[key : string] : string}>({})

  useEffect(()=>{
    let active = true
    if (!props.exp && !active) return
    async function getURLs(){
      const tempURLs = ((await generateTemporaryUrl(props.exp.files, props.exp.id!)).data as [string, string])
      setFileURLs((prev)=>({...prev, [tempURLs[0]]: tempURLs[1]}))
    }
    getURLs()
    return () => {
      active = false;
    };
  },[props.exp])

  function handleChange(e: any) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
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
        const {url, key} = await uploadToS3(filesArr[i],{
          endpoint : {
            request : {
              body : {
                transactionId : props.exp.id
              }
            }
          }
        })
        fileKeys = [...fileKeys, key]
        if (url){
          const r = await axios.post(`/api/generate-temporary-url`, {keys : [key]})
          setFileURLs((prev)=>({...prev, [r.data.temporaryUrls[0]]: r.data.temporaryUrls[1]}))
        }
      }
      let {data, error} = await (await getSupabase(await getToken({template: "supabase"}))).from('expenses').update({files: fileKeys.map((key : string)=>key.split('/').splice(-1))}).eq('id', props.id).select()
      return {error : !(error == null)}
    }
  }

  function handleDrop(e: any) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      for (let i = 0; i < e.dataTransfer.files["length"]; i++) {
        console.log((e.dataTransfer.files[i] as File).size/1000000 <= 5)
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
    <div className="grid grid-cols-2 text-lg">
      <div className="w-[90%]">
          <div className="text-black">Transaction Label</div>
          <div className="text-black bg-gray-800/20 py-2 px-2 break-words border border-black rounded-md">{props.exp.label}</div>
      </div>
      <div className="w-[90%]">
          <div className="text-black">Transaction Amount</div>
          <div className="text-black bg-gray-800/20 py-2 px-2 break-words border border-black rounded-md">{new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: props.exp.currency,
      }).format(props.exp.amount)}</div>
      </div>
      <div className="col-span-2">
          <Text>This transaction took place on <Bold>{new Date(props.exp.transaction_date).toLocaleDateString()}</Bold>.</Text>
      </div>
      <div className="min-w-full col-span-2">
      <div className="py-3 grid grid-cols-3">
        {fileURLs.map((file : string, idx : number)=>{
          return (<div className="w-12 h-fit mx-auto">
            <Link target="_blank" href={file[1]}><FolderOpenIcon className="h-full"/></Link>
          </div>)
        })}
      </div>
      <form
        className={`${
          dragActive ? "bg-gray-300" : "bg-gray-100"
        }  p-4 mb-8 w-full h-fit rounded-lg min-h-24 border text-center items-center justify-center`}
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
        <div className="my-auto">
          <Bold>Drag & Drop files</Bold><br/>
          <Italic>or</Italic><br/>
            <span
              className="font-bold text-blue-600 cursor-pointer"
              onClick={openFileExplorer}
            >
              <u>Select files</u>
            </span>{" "}
            to upload
        </div>

        <div className="flex flex-col items-center p-3">
          {filesArr.map((file: any, index: any) => (
            <div key={index} className="flex flex-row space-x-5">
              <Text className="text-ellipsis whitespace-nowrap w-48 truncate">{file.name}</Text>
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


      </form>
      </div>
        <div className="relative h-12 col-span-2">
          <button 
            disabled={filesArr.length == 0} 
            id={'submit'}
            data-modal-hide="defaultModal" type="button" 
            onClick={handleSubmitFile}
            className={`inline-flex float-right justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2`}
            >Save Files</button>
          <button  
            id={'cancel'}
            data-modal-hide="defaultModal" type="button" 
            className={`inline-flex float-left justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2`}
            onClick={async()=>{props.setOpen(false)}}>Close
          </button>
        </div>
      </div>
      
    </>
  );
}