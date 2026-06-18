import { Head } from "@inertiajs/react";
import NavbarLayout from "@/components/navbar";

import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Section1 from "./components/Section1";
import MainLayout from "./MainLayout";

export default function Home() {
    return (
        <>
            <div className="p-14">
                <Head title="Beranda"/>
                {/* Section 1 */}
                <Section1 />
            </div>
        </>
    );
}
Home.layout = (page: React.ReactNode) => <MainLayout children={page} />;