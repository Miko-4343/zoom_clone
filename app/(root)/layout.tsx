import react, {ReactNode} from "react";
import StreamVideoProvider from "@/providers/streamClientProvider";
import type {Metadata} from "next";

export const metadata: Metadata = {
    title: "Yoom",
    description: "Video calling app",
    icons:{
        icon: "/icons/logo.svg"
    }
};
const RootLayout = ({children}: {children: ReactNode}) => {
    return(
        <main>
            <StreamVideoProvider >
                {children}
            </StreamVideoProvider>
        </main>
    )
}

export default RootLayout;