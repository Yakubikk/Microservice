import {LogoutButton} from "@/components/inputs/logout-button/logout-button.component";

export default function Home() {
    return (
        <div>
            <h1 className="text-3xl font-bold underline">
                Hello world!
            </h1>
            <p className="my-4 text-lg">
                Это приложение на Next.js 15 с поддержкой Prisma и Tailwind CSS.
            </p>
            <LogoutButton />
        </div>
    );
}
