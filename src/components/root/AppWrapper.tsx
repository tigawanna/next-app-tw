import { Home } from "lucide-react";
import { Sidebar } from "./Sidebar";

interface AppWrapperProps {
    children: React.ReactNode
}

export function AppWrapper({ children }: AppWrapperProps) {
    return (
        <div className='w-full h-screen flex items-center justify-center'>
            <div className='w-[150px] h-full flex flex-col items-center justify-center'>
                <Sidebar />
            </div>
            <div className="w-full h-screen overflow-y-scroll">
                {children}
            </div>


        </div>
    );
}
