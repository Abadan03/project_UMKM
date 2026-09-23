import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import type { MouseEvent } from "react";

interface PaginationWrapperProps {
    currentPage: number;
    totalPages: number;
    onPageChange?: (page: number) => void;
    getPageHref?: (page: number) => string;
}

export default function PaginationWrapper({
    currentPage,
    totalPages,
    onPageChange,
    getPageHref = (page) => `?page=${page}`,
}: PaginationWrapperProps) {
    const pages = Array.from(
        new Set([1, 2, 3, totalPages].filter((page) => page <= totalPages)),
    );

    const handlePageChange = (
        event: MouseEvent<HTMLAnchorElement>,
        page: number,
    ) => {
        if (!onPageChange) return;

        event.preventDefault();
        onPageChange(page);
    };

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        href={getPageHref(Math.max(currentPage - 1, 1))}
                        onClick={(event) =>
                            handlePageChange(
                                event,
                                Math.max(currentPage - 1, 1),
                            )
                        }
                        aria-disabled={currentPage === 1}
                        className={
                            currentPage === 1
                                ? "pointer-events-none opacity-50"
                                : undefined
                        }
                    />
                </PaginationItem>

                {pages.map((page) => (
                    <PaginationItem key={page}>
                        <PaginationLink
                            href={getPageHref(page)}
                            isActive={page === currentPage}
                            onClick={(event) => handlePageChange(event, page)}
                        >
                            {page}
                        </PaginationLink>
                    </PaginationItem>
                ))}

                {totalPages > 4 && (
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                )}

                <PaginationItem>
                    <PaginationNext
                        href={getPageHref(
                            Math.min(currentPage + 1, totalPages),
                        )}
                        onClick={(event) =>
                            handlePageChange(
                                event,
                                Math.min(currentPage + 1, totalPages),
                            )
                        }
                        aria-disabled={currentPage === totalPages}
                        className={
                            currentPage === totalPages
                                ? "pointer-events-none opacity-50"
                                : undefined
                        }
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
