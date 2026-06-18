import React from 'react'
import MainLayout from '../MainLayout';

export default function Feature() {
  return (
    <>
        <section className="min-h-screen flex flex-col items-center justify-center p-4 pt-16">
            <h1 className="text-5xl font-bold leading-tight text-center text-slate-900">
                Fitur Kami
                <br />
                Beberapa Fitur unggulan dan kekurangan
            </h1>
        </section>
    </>
  )
}

Feature.layout = (page: React.ReactNode) => <MainLayout children={page} />;