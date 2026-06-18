import React from "react";
import MainLayout from "../MainLayout";
import { CardPlans } from "@/components/C/PP";
import { Button } from "@/components/ui/button";

export default function Pricing() {
    return (
        <section className="min-h-screen w-full flex flex-col items-center justify-center gap-12">
            <h1 className="text-5xl font-bold leading-tight text-center text-slate-900">
                Pricing Plans
                <br />
                Choose the plan that's right for you
            </h1>

            <div className="grid w-full max-w-7xl gap-8 px-4 lg:grid-cols-2">
                <CardPlans
                    title="Basic"
                    price="$29"
                    planKey="Basic"
                    description="Perfect for small businesses and startups."
                />

                <CardPlans
                    title="Professional"
                    price="$59"
                    planKey="professional"
                    description="Advanced tools for growing businesses."
                />
            </div>
        </section>
    );
}

Pricing.layout = (page: React.ReactNode) => <MainLayout>{page}</MainLayout>;
