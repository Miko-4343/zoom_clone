"use client"
import Image from "next/image";
import HomeCard from "@/components/ui/HomeCard";
import {useState} from "react";
import {useRouter} from "next/navigation";
import MeetingModal from "@/components/MeetingModal";
import {useUser} from "@clerk/nextjs";
import {Call, useStreamVideoClient} from "@stream-io/video-react-sdk";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import ReactDatePicker from "react-datepicker"
import {Input} from "@/components/ui/input";


const MeetingTypeList = () =>{
    const router = useRouter();
    const { user } = useUser();
    const client = useStreamVideoClient();
    const [meetingState, setMeetingState] = useState<"isScheduleMeeting"| "isJoiningMeeting"| "isInstantMeeting" | undefined>();
    const [values, setValues] = useState({
        dateTime: new Date(),
        description: "",
        link: ""
    })
    const [callDetails, setCallDetails] = useState<Call>();
    const { toast } = useToast()

    const createMeeting = async () =>{
        if(!values.dateTime){
            toast({
                title: "Please select a date and a time",
            });
            return;
        }
        if(!client || !user) return;
        try{
            const id = crypto.randomUUID();
            const call = client.call("default", id);

            if(!call) throw new Error("Failed to create a call");

            const startsAt = values.dateTime.toISOString() || new Date(Date.now()).toISOString();
            const description = values.description || "Instant meeting";
            await call.getOrCreate({
                data: {
                    starts_at: startsAt,
                    custom:{
                        description
                    }
                }
            })
            setCallDetails(call);
            if(!values.description){
                router.push(`/meeting/${call.id}`);
            }
            toast({
                title: "Meeting created",
            })
        } catch (error){
            console.log(error);
            toast({
                title: "Failed to create meeting"
            })
        }
    };

    const meetingLink = `${process.env.NEXT_PUBLIC_BASE_UR}/meeting/${callDetails?.id}`;
    return(
        <section className={"grid grid-col-1 gap-5 md:grid-cols-2 xl:grid-cols-4"}>
            <HomeCard
                img={"/icons/add-meeting.svg"}
                title={"New Meeting"}
                description={"Start an instant meeting"}
                handleClick={()=>setMeetingState("isInstantMeeting")}
                className={"bg-orange-1"}
            />
            <HomeCard
                img={"/icons/join-meeting.svg"}
                title={"Join Meeting"}
                description={"via invitation link"}
                handleClick={()=>setMeetingState("isJoiningMeeting")}
                className={"bg-blue-1"}
            />
            <HomeCard
                img={"/icons/schedule.svg"}
                title={"Schedule a Meeting"}
                description={"Plan your meeting"}
                handleClick={()=>setMeetingState("isScheduleMeeting")}
                className={"bg-purple-1"}
            />
            <HomeCard
                img={"/icons/recordings.svg"}
                title={"View Recordings"}
                description={"Check out your recordings"}
                handleClick={() => router.push('/recordings')}
                className={"bg-yellow-1"}
            />
            {!callDetails ?
                <MeetingModal
                isOpen={meetingState === "isScheduleMeeting"}
                onClose={()=> setMeetingState(undefined)}
                title={"Create a meeting"}
                handleClick={createMeeting}
                >
                   <div className={"flex flex-col gap-2.5"}>
                        <label className={"text-base text-normal leading-[22px] text-sky-2"}>Add a description</label>
                       <Textarea className={"border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"}
                       onChange={(e)=>{
                           setValues({...values, description: e.target.value})
                       }}
                        />
                   </div>
                    <div className={"flex w-full flex-col gap-2.5"}>
                        <label className={"text-base text-normal leading-[22px] text-sky-2"}>Select date and time</label>
                        <ReactDatePicker
                        selected={values.dateTime}
                        onChange={(date)=>setValues({...values, dateTime: date!})}
                        showTimeSelect={true}
                        timeFormat={"HH:mm"}
                        timeIntervals={15}
                        timeCaption={"time"}
                        dateFormat={"MMMM d, yyyy h:mm aa"}
                        className={"w-full rounded bg-dark-3 p-2 focus:outline-none"}
                        />
                    </div>
                </MeetingModal>
                :
                <MeetingModal
                    isOpen={meetingState === "isScheduleMeeting"}
                    onClose={()=> setMeetingState(undefined)}
                    title={"Meeting created"}
                    className={"text-center"}
                    handleClick={()=>{}
                        //navigator.clipboard.writeText(meeting.link)
                    }
                    image={"icons/checked.svg"}
                    buttonIcon={"/icons/copy.svg"}
                    buttonText={"Copy Invitation"}
                />}
            <MeetingModal
                isOpen={meetingState === 'isJoiningMeeting'}
                onClose={() => setMeetingState(undefined)}
                title="Type the link here"
                className="text-center"
                buttonText="Join Meeting"
                handleClick={() => router.push(values.link)}
            >
                <Input
                    placeholder="Meeting link"
                    onChange={(e) => setValues({ ...values, link: e.target.value })}
                    className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
            </MeetingModal>
            <MeetingModal
                isOpen={meetingState === "isInstantMeeting"}
                onClose={()=> setMeetingState(undefined)}
                title={"Start an instant meeting"}
                className={"text-center"}
                buttonText={"Start meeting"}
                handleClick={createMeeting}
            />
        </section>
    )
}

export default MeetingTypeList;