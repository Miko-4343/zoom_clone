"use client";
import {useCall, useCallStateHooks} from "@stream-io/video-react-sdk";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";


const EndCallButton = ()=>{
    const call = useCall();
    const router = useRouter();
    const { useLocalParticipant } = useCallStateHooks();
    const local = useLocalParticipant();


    const isMeetingOwner = local && call?.state.createdBy && local.userId === call?.state.createdBy.id

    if(!isMeetingOwner) return null;
    return(
        <Button onClick={async ()=>{
            await call?.endCall();
            router.push("/")
        }}
        className={"bg-red-500"}
        >
         End call for Everyone
        </Button>
    )
}

export default EndCallButton;