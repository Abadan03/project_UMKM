import { ChartNoAxesColumnIncreasing } from "lucide-react";

export default function AppLogo() {
    return (
        <>
            <ChartNoAxesColumnIncreasing className="size-4 fill-current text-black dark:text-black" />

            <div
                className="
                    ml-1
                    grid
                    flex-1
                    text-left
                    text-sm

                    group-data-[collapsible=icon]:hidden
                "
            >
                <span className="mb-0.5 truncate leading-none font-semibold">
                    Dashboard
                </span>
            </div>
        </>
    );
}
