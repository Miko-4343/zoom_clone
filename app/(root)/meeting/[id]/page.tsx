"use client";
import {useUser} from "@clerk/nextjs";
import {StreamCall, StreamTheme} from "@stream-io/video-react-sdk";
import {useState} from "react";
import MeetingRoom from "@/components/MeetingRoom";
import MeetingSetup from "@/components/MeetingSetup";
import {useGetCallById} from "@/hooks/useGetCallByIDd";
import Loader from "@/components/Loader";


const Meeting = ({ params: {id}}: { params: { id: string } }) => {
    const { user, isLoaded } = useUser();
    const [isSetupcomplete, setisSetupcomplete] = useState(false);
    const {call, isCallLoading} = useGetCallById(id);

    if(!isLoaded || isCallLoading) return <Loader />
    return(
        <main className={"h-screen w-full "}>
            <StreamCall call={call}>
                <StreamTheme>
                    {!isSetupcomplete?(
                        <MeetingSetup setisSetupcomplete={setisSetupcomplete}/>
                    ): (
                        <MeetingRoom />
                    )}
                </StreamTheme>
            </StreamCall>
        </main>
    )
}

export default Meeting;