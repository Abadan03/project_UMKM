import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";
import { Users, Banknote, ShoppingCart, Activity } from "lucide-react";
import { ChartBarDefault } from "@/components/bar-chart";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Dashboard",
        href: "/dashboard",
    },
];

// Data Dummy untuk Statistik Atas
const statsData = [
    { title: "Total Revenue", value: "Rp 45.2M", icon: Banknote, color: "bg-[#ffdd00]" }, // Kuning
    { title: "New Users", value: "+1,204", icon: Users, color: "bg-[#44ddff]" }, // Cyan
    { title: "Total Sales", value: "842", icon: ShoppingCart, color: "bg-[#ff44aa]" }, // Pink
];

// Data Dummy untuk Bar Chart (Tinggi dalam persentase)
const chartData = [
    { label: "JAN", value: 40 },
    { label: "FEB", value: 70 },
    { label: "MAR", value: 45 },
    { label: "APR", value: 90 },
    { label: "MAY", value: 65 },
    { label: "JUN", value: 100 },
    { label: "JUL", value: 85 },
];

// Data Dummy untuk Progress List
const topProducts = [
    { name: "Retro Keyboard", sales: 85, color: "bg-[#ff44aa]" },
    { name: "Pixel Monitor", sales: 60, color: "bg-[#44cc44]" },
    { name: "Arcade Stick", sales: 45, color: "bg-[#ffdd00]" },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            
            {/* Wrapper utama Dashboard */}
            <div className="font-mono uppercase flex flex-col gap-6 bg-[#2e1044] p-6 min-h-screen text-[#1a0a2e]">
                
                {/* --- BAGIAN 1: KARTU STATISTIK --- */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {statsData.map((stat, index) => (
                        <div 
                            key={index} 
                            className={`border-4 border-[#1a0a2e] ${stat.color} p-5 shadow-[6px_6px_0px_0px_#1a0a2e] hover:-translate-y-1 hover:shadow-[6px_10px_0px_0px_#1a0a2e] transition-all`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="font-bold text-lg">{stat.title}</h3>
                                <div className="p-2 border-2 border-[#1a0a2e] bg-white shadow-[2px_2px_0px_0px_#1a0a2e]">
                                    <stat.icon size={24} />
                                </div>
                            </div>
                            <p className="text-3xl font-black tracking-widest">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* --- BAGIAN 2: MAIN CHART & SIDE CONTENT --- */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    
                    {/* BAR CHART MURNI CSS (Kolom mengambil 2/3 ruang) */}
                    <div className="md:col-span-2 border-4 border-[#1a0a2e] bg-[#ddc8f0] p-6 shadow-[8px_8px_0px_0px_#1a0a2e] flex flex-col">
                        <div className="flex items-center gap-3 mb-6 border-b-4 border-[#1a0a2e] pb-4">
                            <Activity size={28} className="text-[#ff44aa]" />
                            <h2 className="text-2xl font-black">Sales Overview</h2>
                        </div>
                        
                        {/* Area Chart */}
                        <ChartBarDefault />
                    </div>

                    {/* TOP PRODUCTS (Progress Bar Kotak) */}
                    <div className="border-4 border-[#1a0a2e] bg-[#ffffff] p-6 shadow-[8px_8px_0px_0px_#1a0a2e] flex flex-col">
                        <h2 className="text-xl font-black mb-6 border-b-4 border-[#1a0a2e] pb-4 bg-[#ffdd00] -mx-6 -mt-6 p-6">
                            Top Products
                        </h2>
                        
                        <div className="flex flex-col gap-6 mt-2">
                            {topProducts.map((item, index) => (
                                <div key={index}>
                                    <div className="flex justify-between font-bold mb-2 text-sm">
                                        <span>{item.name}</span>
                                        <span>{item.sales}%</span>
                                    </div>
                                    {/* Track Progress */}
                                    <div className="h-6 w-full border-2 border-[#1a0a2e] bg-gray-200">
                                        {/* Isi Progress kaku */}
                                        <div 
                                            style={{ width: `${item.sales}%` }} 
                                            className={`h-full border-r-2 border-[#1a0a2e] ${item.color}`}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                </div>
            </div>
        </AppLayout>
    );
}