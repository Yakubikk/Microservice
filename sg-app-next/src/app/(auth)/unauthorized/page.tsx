import Link from "next/link";

export default function Unauthorized() {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-2xl font-bold">Unauthorized</h1>
            <p className="mt-4 text-gray-600">You do not have permission to access this page.</p>
            <Link href="/" className="mt-6 text-blue-500 hover:underline">
                Go back to home
            </Link>
        </div>
    );
}