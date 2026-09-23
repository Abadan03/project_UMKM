import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    MoreHorizontalIcon,
} from "lucide-react";

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
    return (
        <nav
            role="navigation"
            aria-label="pagination"
            data-slot="pagination"
            className={cn("mx-auto flex w-full justify-center", className)}
            {...props}
        />
    );
}

function PaginationContent({
    className,
    ...props
}: React.ComponentProps<"ul">) {
    return (
        <ul
            data-slot="pagination-content"
            className={cn("flex items-center gap-1", className)}
            {...props}
        />
    );
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
    return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = {
    isActive?: boolean;
} & Pick<React.ComponentProps<typeof Button>, "size"> &
    React.ComponentProps<"a">;

function PaginationLink({
    className,
    isActive,
    size = "icon",
    ...props
}: PaginationLinkProps) {
    return (
        <Button
            asChild
            variant={isActive ? "outline" : "ghost"}
            size={size}
            className={cn(
                "border-2 border-[#1a0a2e] shadow-[2px_2px_0px_0px_#1a0a2e] transition-all",
                isActive
                    ? "bg-[#ff8800] text-[#1a0a2e] hover:bg-[#ddc8f0]"
                    : "bg-[#2D3748] text-[#ddc8f0] hover:bg-[#ddc8f0] hover:text-[#2D3748]",
                className,
            )}
        >
            <a
                aria-current={isActive ? "page" : undefined}
                data-slot="pagination-link"
                data-active={isActive}
                {...props}
            />
        </Button>
    );
}

function PaginationPrevious({
    className,
    text = "Previous",
    ...props
}: React.ComponentProps<typeof PaginationLink> & { text?: string }) {
    return (
        <PaginationLink
            aria-label="Go to previous page"
            size="default"
            className={cn(
                "pl-2! bg-[#2D3748] text-[#ddc8f0] hover:bg-[#ddc8f0] hover:text-[#2D3748] border-2 border-[#1a0a2e] shadow-[2px_2px_0px_0px_#1a0a2e]",
                className,
            )}
            {...props}
        >
            <ChevronLeftIcon data-icon="inline-start" />
            <span className="hidden sm:block">{text}</span>
        </PaginationLink>
    );
}

function PaginationNext({
    className,
    text = "Next",
    ...props
}: React.ComponentProps<typeof PaginationLink> & { text?: string }) {
    return (
        <PaginationLink
            aria-label="Go to next page"
            size="default"
            className={cn(
                "pr-2! bg-[#2D3748] text-[#ddc8f0] hover:bg-[#ddc8f0] hover:text-[#2D3748] border-2 border-[#1a0a2e] shadow-[2px_2px_0px_0px_#1a0a2e]",
                className,
            )}
            {...props}
        >
            <span className="hidden sm:block">{text}</span>
            <ChevronRightIcon data-icon="inline-end" />
        </PaginationLink>
    );
}

function PaginationEllipsis({
    className,
    ...props
}: React.ComponentProps<"span">) {
    return (
        <span
            aria-hidden
            data-slot="pagination-ellipsis"
            className={cn(
                "flex size-9 items-center justify-center [&_svg:not([class*='size-'])]:size-4",
                className,
            )}
            {...props}
        >
            <MoreHorizontalIcon />
            <span className="sr-only">More pages</span>
        </span>
    );
}

export {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
};
