import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
} from "@headlessui/react";
import { Link, usePage } from "@inertiajs/react";
import LI from "./C/LI";

const navigation = [
    { name: "Home", href: "/", current: true },
    { name: "Feature", href: "/feature", current: false },
    { name: "Pricing", href: "/pricing", current: false },
    { name: "Contact", href: "#", current: false },
];

function classNames(...classes: any) {
    return classes.filter(Boolean).join(" ");
}

export default function NavbarLayout() {
    const { url } = usePage();

    return (
        <Disclosure as="nav" className="fixed top-4 left-0 right-0 z-50 font-mono">
            <div
                className="relative mx-auto px-3 sm:px-6 w-[95%] lg:px-10 bg-[#3c2060]"
                style={{
                    border: "4px solid #1a0a2e",
                    boxShadow: "6px 6px 0 #1a0a2e",
                }}
            >
                <div className="flex h-16 flex-1 items-center justify-between flex-wrap gap-y-2">
                    <div className="flex shrink-0 items-center space-x-3">
                        <div
                            className="h-8 w-8 flex items-center justify-center shrink-0 bg-[#ffdd00]"
                            style={{
                                border: "3px solid #1a0a2e",
                                boxShadow: "3px 3px 0 #1a0a2e",
                            }}
                        >
                            <img
                                alt="Your Company"
                                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                                className="h-5 w-auto"
                                style={{ imageRendering: "pixelated" }}
                            />
                        </div>
                        <h1
                            className="text-white text-lg tracking-widest font-bold"
                            style={{ textShadow: "2px 2px 0 #1a0a2e" }}
                        >
                            COMPANY
                        </h1>
                    </div>

                    <div className="flex shrink-0 items-center space-x-5">
                        <div className="flex items-center space-x-3 flex-wrap">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    aria-current={
                                        url === item.href ? "page" : undefined
                                    }
                                    className={classNames(
                                        url === item.href
                                            ? "text-white border-b-[3px] border-[#44ddff]"
                                            : "text-[#ddc8f0] border-b-[3px] border-transparent hover:text-[#ffdd00] hover:border-[#ff8800]",
                                        "rounded-none px-1 py-2 text-[15px] font-bold tracking-wider uppercase"
                                    )}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                        <Link href="login">
                            <LI />
                        </Link>
                    </div>
                </div>
            </div>

            <DisclosurePanel className="sm:hidden">
                <div
                    className="space-y-1 px-2 pt-2 pb-3 mt-2 bg-[#3c2060]"
                    style={{
                        border: "4px solid #1a0a2e",
                        boxShadow: "6px 6px 0 #1a0a2e",
                    }}
                >
                    {navigation.map((item) => (
                        <DisclosureButton
                            key={item.name}
                            as="a"
                            href={item.href}
                            aria-current={item.current ? "page" : undefined}
                            className={classNames(
                                item.current
                                    ? "text-white bg-[#1a0a2e]/60"
                                    : "text-[#ddc8f0] hover:text-[#ffdd00] hover:bg-[#1a0a2e]/40",
                                "block rounded-none px-3 py-2 text-xs font-bold tracking-wider uppercase"
                            )}
                        >
                            {item.name}
                        </DisclosureButton>
                    ))}
                </div>
            </DisclosurePanel>
        </Disclosure>
    );
}