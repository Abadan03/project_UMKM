import { Button } from '@/components/ui/button'
import dashboardwithperson from "@/asset/img/dashboardwithperson.png";

import { Sparkles } from 'lucide-react'
import React from 'react'

export default function Section1() {
  return (
    <>
        <section className="min-h-screen flex flex-col items-center justify-center p-4 pt-16">
            <h1 className="text-5xl font-bold leading-tight text-center text-slate-900">
                The Ultimate Solution For
                <br />
                Optimizing Your Sales Process
            </h1>

            <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:items-center">
                {/* Dashboard Image */}
                <div>
                    <img
                        src={dashboardwithperson}
                        alt="Dashboard"
                        className="w-full "
                    />
                </div>

                {/* Content */}
                <div>
                    <p className="text-sm leading-7 text-slate-600">
                        Welcome To Salesgear SaaS Dashboard, Your
                        Ultimate Solution For Streamlined Sales
                        Management. Whether You're A Small Business Or A
                        Large Enterprise, Our Platform Empowers You To
                        Take Control Of Your Sales Processes With Ease.
                    </p>

                    <div className="mt-8 flex gap-4">
                        <Button className="bg-teal-700 hover:bg-teal-800">
                            Get Started
                        </Button>

                        <Button
                            variant={"outline"}
                            className="border-slate-300"
                        >
                            Learn More
                        </Button>
                    </div>

                    <div className="mt-10 grid grid-cols-3 gap-6">
                        <div>
                            <h3 className="text-4xl font-bold text-slate-900">
                                50M
                            </h3>
                            <p className="mt-1 text-sm text-slate-500">
                                Downloaded
                            </p>
                        </div>

                        <div>
                            <h3 className="text-4xl font-bold text-slate-900">
                                190+
                            </h3>
                            <p className="mt-1 text-sm text-slate-500">
                                Active user
                            </p>
                        </div>

                        <div>
                            <h3 className="text-4xl font-bold text-slate-900">
                                100+
                            </h3>
                            <p className="mt-1 text-sm text-slate-500">
                                Business teams
                            </p>
                        </div>
                    </div>

                    <div className="mt-10 flex items-center gap-4 rounded-xl bg-slate-50 p-4">
                        <Sparkles />

                        <p className="text-sm text-slate-600">
                            Over one million Businessmen have given a
                            5-star review to their salesgear.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    </>
  )
}
