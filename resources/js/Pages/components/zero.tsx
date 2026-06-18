import zeroSC from "@/asset/img/zeroSC.png";
import { CardGlassEffect } from "@/components/C/CGE";
import { Sparkles } from "lucide-react";

export default function Section1() {
    return (
        <>
            <section className="min-h-screen flex flex-col items-center justify-center">
                <h1 className="text-5xl font-bold leading-tight text-center text-slate-900">
                    The Ultimate Solution For
                    <br />
                    Optimizing Your Sales Process
                </h1>

                <div className="mt-12 w-full flex items-center justify-around">
                    {/* Content */}
                    <div className="w-1/2 flex flex-col items-start">
                        <CardGlassEffect />
                        <div className="mt-12 flex items-center gap-4 rounded-xl bg-slate-50 p-4">
                            <Sparkles />

                            <p className="text-sm text-slate-600">
                                Over one million Businessmen have given a 5-star
                                review to their salesgear.
                            </p>
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <img
                            src={zeroSC}
                            alt="Dashboard"
                            className="w-full max-w-md h-auto object-contain"
                        />
                    </div>
                </div>
            </section>
        </>
    );
}
