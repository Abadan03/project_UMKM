import { Breadcrumbs } from "@/components/breadcrumbs";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { type BreadcrumbItem as BreadcrumbItemType } from "@/types";

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    return (
        <header className="font-mono uppercase rounded-none flex h-16 shrink-0 items-center gap-4 border-b-4 border-[#1a0a2e] bg-[#3c2060] px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4 shadow-[0px_4px_0px_0px_#1a0a2e] relative z-10">
            <div className="flex items-center gap-4">
                
                {/* Tombol Sidebar */}
                <div className="flex items-center justify-center bg-[#ffdd00] border-2 border-[#1a0a2e] shadow-[3px_3px_0px_0px_#1a0a2e] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_#1a0a2e] active:bg-[#ff8800] transition-all cursor-pointer">
                    <SidebarTrigger className="text-[#1a0a2e] hover:bg-transparent rounded-none" />
                </div>
                
                {/* PERBAIKAN: Tambahkan [&_*]:text-[#ddc8f0] untuk memaksa semua text di dalam Breadcrumbs jadi warna ungu muda */}
                {/* Saya juga menambahkan efek hover warna kuning saat link-nya disorot */}
                <div className="font-bold text-sm tracking-wide drop-shadow-[2px_2px_0px_#1a0a2e] [&_*]:text-[#ddc8f0] [&_a:hover]:text-[#ffdd00] [&_*]:transition-colors">
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div>
                
            </div>
        </header>
    );
}