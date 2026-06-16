import { Head } from '@inertiajs/react';

export default function Home({ nama }) {
    return (
        <>
            <Head title="Beranda" />
            <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
                <h1>Halo, {nama}!</h1>
                <p>Inertia v3 + React berhasil dikonfigurasi.</p>
            </div>
        </>
    );
}