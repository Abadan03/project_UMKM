import { Head } from "@inertiajs/react";
import ZeroSection from "@/Pages/components/zero";
import MainLayout from "./MainLayout";

export default function Home() {
    return (
        <>
            <div>
                <Head title="Beranda" />
                {/* Section 1 */}
                <ZeroSection />
            </div>
        </>
    );
}
Home.layout = (page: React.ReactNode) => <MainLayout children={page} />;
