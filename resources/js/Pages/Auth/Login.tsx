import { Link, useForm } from "@inertiajs/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import zeroSC from "@/asset/img/zeroSC.png";

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
        password: "",
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post("/login");
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#2e1044] px-4 text-[#1a0a2e]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_#8860b0_0,_#3c2060_35%,_#2e1044_70%,_#1a0a2e_100%)]" />
            <div className="absolute inset-0 opacity-15 [background-image:linear-gradient(#ffdd00_1px,transparent_1px),linear-gradient(90deg,#ffdd00_1px,transparent_1px)] [background-size:28px_28px]" />
            <div className="absolute inset-0 flex items-center justify-center">
                <img
                    src={zeroSC}
                    alt="Growbit background illustration"
                    className="w-[900px] max-w-none opacity-35 blur-xl"
                    style={{ imageRendering: "pixelated" }}
                />
            </div>
            <div className="absolute inset-0 bg-[#1a0a2e]/35 backdrop-blur-[2px]" />

            <div className="relative z-10 w-full max-w-md border-4 border-[#ddc8f0]/55 bg-white/12 p-6 shadow-[12px_12px_0px_0px_rgba(26,10,46,0.9)] backdrop-blur-xl retro-enter">
                <Link
                    href="/"
                    className="mb-5 inline-flex items-center gap-2 border-4 border-[#1a0a2e] bg-[#ff8800]/95 px-3 py-2 font-mono text-[10px] font-black uppercase tracking-[0.24em] text-[#1a0a2e] shadow-[5px_5px_0px_0px_#1a0a2e] transition-transform hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#1a0a2e]"
                >
                    <ArrowLeft size={14} />
                    Back To Home
                </Link>

                <div className="mb-6 border-4 border-[#1a0a2e] bg-[#ffdd00]/92 p-4 text-center shadow-[6px_6px_0px_0px_#1a0a2e]">
                    <h1 className="font-mono text-3xl font-black uppercase text-[#1a0a2e]">
                        Growbit
                    </h1>
                    <p className="mt-2 font-mono text-xs font-bold uppercase tracking-[0.24em] text-[#5a3888]">
                        Sign in to continue
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label className="block font-mono text-xs font-black uppercase tracking-[0.24em] text-[#5a3888]">
                            Email
                        </label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            placeholder="email@contoh.com"
                            className={`w-full border-4 bg-white/70 px-4 py-3 font-mono text-sm text-[#1a0a2e] placeholder:text-[#5a3888] outline-none backdrop-blur-sm ${
                                errors.email ? "border-[#ff4444]" : "border-[#1a0a2e]"
                            }`}
                        />
                        {errors.email && (
                            <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#ff8800]">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="block font-mono text-xs font-black uppercase tracking-[0.24em] text-[#5a3888]">
                            Password
                        </label>
                        <input
                            type="password"
                            value={data.password}
                            onChange={(e) => setData("password", e.target.value)}
                            placeholder="********"
                            className={`w-full border-4 bg-white/70 px-4 py-3 font-mono text-sm text-[#1a0a2e] placeholder:text-[#5a3888] outline-none backdrop-blur-sm ${
                                errors.password ? "border-[#ff4444]" : "border-[#1a0a2e]"
                            }`}
                        />
                        {errors.password && (
                            <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#ff8800]">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex w-full items-center justify-center gap-2 border-4 border-[#1a0a2e] bg-[#44cc44] px-4 py-3 font-mono text-xs font-black uppercase tracking-[0.28em] text-[#1a0a2e] shadow-[6px_6px_0px_0px_#1a0a2e] transition-transform hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0px_0px_#1a0a2e] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {processing ? "Memproses" : "Masuk"}
                        <ArrowRight size={16} />
                    </button>
                </form>
            </div>
        </div>
    );
}
