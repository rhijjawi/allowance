import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import React, { Dispatch } from "react";

export default function ReportABug({isOpen, setIsOpen} : {isOpen : boolean, setIsOpen : Dispatch<boolean>}) {
    const {user, isSignedIn} = useUser();
    const postURL = isSignedIn ? "https://eoq198g7ikfeqsy.m.pipedream.net/submit-bug?user=" + user?.id : "https://eoq198g7ikfeqsy.m.pipedream.net/submit-bug"
    return (
        <motion.div initial={"hidden"} animate={"visible"} variants={{
            hidden: {
                opacity: 0,
                y: 100,
            },
            visible: {
                opacity: 1,
                y: 0,
                transition: {
                    delay: 0.1,
                }
            }
        }} className={`fixed inset-0 z-[100] ${isOpen ? 'block' : 'hidden'}`}
        >
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-screen backdrop-blur-sm blur h-screen fixed top-0" onClick={()=>{setIsOpen(false)}}/>
          <div className="bg-dark-tremor-background-muted blur-0 p-8 rounded-lg shadow-md w-full md:w-2/3 lg:w-1/2">
              <h1 className="text-2xl font-semibold mb-6 text-white">Report a Bug</h1>
              <form onSubmit={(e)=>{
                const formData = new FormData();
                formData.append("bugTitle", (e.target as any).bugTitle.value);
                formData.append("bugDescription", (e.target as any).bugDescription.value);
                formData.append("screenshot", (e.target as any).screenshot.files[0]);
                fetch(postURL, {
                    method: "POST",
                    headers : {contentType: "multipart/form-data"},
                    body: formData
                })
                setIsOpen(false)
                e.stopPropagation()
                e.preventDefault()}} className="space-y-4">
                  <div>
                      <label htmlFor="bugTitle" className="block text-sm font-medium text-white">Bug Title</label>
                      <input type="text" id="bugTitle" name="bugTitle" className="mt-1 p-2 w-full border rounded-md text-indigo-500" />
                  </div>
                  <div>
                      <label htmlFor="bugDescription" className="block text-sm font-medium text-white">Bug Description</label>
                      <textarea id="bugDescription" name="bugDescription" rows={4} className="mt-1 p-2 w-full border rounded-md text-indigo-400"></textarea>
                  </div>
                  <div>
                    <label htmlFor="screenshot" className="block text-sm font-medium text-white">Screenshot</label>
                    <input type="file" id="screenshot" name="screenshot" accept="image/*" className="mt-1 p-2 w-full border text-white rounded-md"/>
                    <p className="text-xs mt-2 text-tremor-background-subtle">Upload a screenshot (image format).</p>
                </div>
                  <div>
                      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">Submit Bug Report</button>
                  </div>
              </form>
          </div>
          </div>
        </motion.div>
    )
}