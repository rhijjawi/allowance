"use client";
import { User } from "@clerk/clerk-sdk-node";
import {
  PlusCircleIcon,
  TrashIcon,
  ClipboardDocumentIcon,
} from "@heroicons/react/24/outline";
import { Button, Title } from "@tremor/react";
import { useEffect, useState } from "react";
import { TextInput } from "@tremor/react";
import { useAlerts } from "@/components/contexts/alertHandler";

export function UserCard({
  user,
  supervisorDelete,
}: {
  user: User;
  supervisorDelete: () => Promise<void>;
}) {
  user = user as User;
  return (
    <div className="dark: relative my-1 grid h-fit w-full grid-cols-10 grid-rows-1 rounded-md border-2 bg-gray-300/20 hover:bg-gray-300/40 dark:border-white/30">
      <div className="col-span-1 h-fit">
        <img
          src={user.imageUrl}
          alt=""
          className="my-2 ml-2 w-[80%] rounded-lg"
        />
      </div>
      <div className="col-span-8 h-fit">
        <p className="pt-2 text-2xl text-black">
          {user.firstName} {user.lastName}
        </p>
        <p className="pb-2 text-sm text-black">
          {user.emailAddresses[0].emailAddress}
        </p>
      </div>
      <Button
        className="relative m-auto aspect-square max-w-full"
        icon={TrashIcon}
        color="red"
        onClick={async () => {
          await supervisorDelete();
        }}
      ></Button>
    </div>
  );
}

export function UserAddCard(props: {
  isReadOnly?: boolean;
  code?: string;
  setSupervisors?: (supervisors: string[]) => void;
}) {
  const [code, setCode] = useState<null[] | string[]>([
    null,
    null,
    null,
    null,
    null,
    null,
  ]);
  useEffect(() => {
    if (props.isReadOnly) {
        fetch("/api/user/parent").then(async (res) => {
        if (res.status == 200) {
          const r = await res.json();
          setCode(r.code.split(""));
        }
      });
    }
  }, [props.isReadOnly]);
  const { addAlert } = useAlerts();
  return (
    <div className="relative mx-auto my-1 grid h-24 w-[70%] grid-cols-12 rounded-md border-2 bg-gray-300/0 dark:border-white/20 ">
      <div className="col-span-12 mr-12 flex items-center justify-center">
        {[0, 1, 2, 3, 4, 5].map((e) => (
          <div
            key={e}
            className="mx-2 inline-block h-[85%] w-14 min-w-[5%] rounded-md bg-gray-300"
          >
            <input
              id={String(e)}
              maxLength={1}
              type="text"
              readOnly={props.isReadOnly}
              disabled={props.isReadOnly}
              defaultValue={code[e] || ""}
              onInput={() => {
                let _code = Object.assign([], code) as string[];
                _code[e as number] = String(
                  (document.getElementById(String(e)) as HTMLInputElement)
                    .value,
                ).toUpperCase();
                setCode(_code);
                document.getElementById(String(e + 1))?.focus();
              }}
              className="border-3 read relative block h-full max-w-full rounded-md border-cyan-800/80 bg-cyan-700/30 px-[30%] text-center text-xl uppercase text-black read-only:outline-none"
            />
          </div>
        ))}
        <Button
          disabled={!(code.join("").length == 6)}
          className="absolute right-0 mr-2 aspect-square max-h-[7%] min-h-[70%]"
          icon={props.isReadOnly ? ClipboardDocumentIcon : PlusCircleIcon}
          color={props.isReadOnly ? "blue" : "green"}
          onClick={async () => {
            if (!props.isReadOnly) {
              if (!(code.join("").length == 6)) return;

              fetch("/api/user/parent", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  code: code.join(""),
                }),
              }).then(async (res) => {
                if (res.status == 200) {
                  const r = await res.json();
                  addAlert("success", "Request sent.")
                }
                else if (res.status == 400 || (await res.json()).error == "exists"){
                  addAlert("error", "Parent already exists!", 2000);
                }
                else if (res.status == 404) {
                  addAlert("error", "Code not found!", 2000);
                }
              });
            } else {
              try {
                await navigator.clipboard.writeText(code.join(""));
              } catch {
                alert(`Error copying to clipboard: ${code.join("")}`);
              }
            }
          }}
        />
      </div>
    </div>
  );
}
