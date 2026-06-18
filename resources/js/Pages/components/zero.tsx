import { Button } from "@/components/ui/button";
import zeroSC from "@/asset/img/zeroSC.png";
import { Sparkles } from "lucide-react";

export default function Section1() {
    return (
        <>
            <section className="min-h-screen flex flex-col items-center justify-center pt-16">
                <h1 className="text-5xl font-bold leading-tight text-center text-slate-900">
                    The Ultimate Solution For
                    <br />
                    Optimizing Your Sales Process
                </h1>

                <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:items-center">
                    {/* Dashboard Image */}
                    <div>
                        <img src={zeroSC} alt="Dashboard" />
                    </div>

                    {/* Content */}
                    <div>
                        <p className="text-sm leading-7 text-slate-600">
                            Welcome To Salesgear SaaS Dashboard, Your Ultimate
                            Solution For Streamlined Sales Management. Whether
                            You're A Small Business Or A Large Enterprise, Our
                            Platform Empowers You To Take Control Of Your Sales
                            Processes With Ease.
                        </p>
                        <div className="mt-10 flex items-center gap-4 rounded-xl bg-slate-50 p-4">
                            <Sparkles />

                            <p className="text-sm text-slate-600">
                                Over one million Businessmen have given a 5-star
                                review to their salesgear.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
