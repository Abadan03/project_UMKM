import { Link, useForm, usePage } from "@inertiajs/react";
import retroPattern from "@/asset/img/retroPattern.jpg";

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
        password: "",
    });

    // const { error } = usePage().props;

    const handleSubmit = (e: any) => {
        e.preventDefault();
        post("/login");
    };

    return (
        <div
            className="min-h-screen relative flex items-center justify-center bg-cover bg-center"
            style={{
                backgroundImage: `url(${retroPattern})`,
            }}
        >
            <div className="bg-white/50 p-8 rounded-2xl shadow-md backdrop-blur-xl w-full max-w-md">
                {/* Logo / Title */}
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-bold text-black">GROWBIT</h1>
                    <p className="text-sm text-gray-900 mt-1">
                        Sign In your account
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email */}
                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 ${
                                errors.email
                                    ? "border-red-500"
                                    : "border-gray-900"
                            }`}
                            placeholder="email@contoh.com"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            value={data.password}
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 ${
                                errors.password
                                    ? "border-red-500"
                                    : "border-gray-900"
                            }`}
                            placeholder="••••••••"
                        />
                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-blue-800 cursor-pointer hover:bg-blue-900 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {processing ? "Memproses..." : "Masuk"}
                    </button>
                </form>
            </div>
        </div>
    );
}
