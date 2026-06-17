import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
} from "@headlessui/react";
import { Button } from "./ui/button";
import { Link } from "@inertiajs/react";

const navigation = [
    { name: "Home", href: "#", current: true },
    { name: "Feature", href: "#", current: false },
    { name: "Pricing", href: "#", current: false },
    { name: "Contact", href: "#", current: false },
];

function classNames(...classes: any) {
    return classes.filter(Boolean).join(" ");
}

export default function NavbarLayout() {
    return (
        <Disclosure as="nav" className="fixed top-4 left-0 right-0 z-50">
            <div className="relative mx-auto rounded-xl px-2 sm:px-6 bg-gray-900 w-[95%] lg:px-10">
                <div className="flex h-16 flex-1 items-center justify-between">
                    <div className="flex shrink-0 items-center space-x-4">
                        <img
                            alt="Your Company"
                            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                            className="h-8 w-auto"
                        />
                        <h1 className="text-white">Company Name</h1>
                    </div>
                    <div className="flex shrink-0 items-center space-x-4">
                        <div className="space-x-4">
                            {navigation.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    aria-current={
                                        item.current ? "page" : undefined
                                    }
                                    className={classNames(
                                        item.current
                                            ? "border-b border-white text-white"
                                            : "text-gray-300 hover:text-white",
                                        "rounded-none px-1 py-2 text-sm font-medium"
                                    )}
                                >
                                    {item.name}
                                </a>
                            ))}
                        </div>
                        <Link href="login">
                            <Button
                                variant={"secondary"}
                                className="py-2 px-4 hover:bg-white/80"
                            >
                                Login
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            <DisclosurePanel className="sm:hidden">
                <div className="space-y-1 px-2 pt-2 pb-3">
                    {navigation.map((item) => (
                        <DisclosureButton
                            key={item.name}
                            as="a"
                            href={item.href}
                            aria-current={item.current ? "page" : undefined}
                            className={classNames(
                                item.current
                                    ? "bg-gray-950/50 text-white"
                                    : "text-gray-300 hover:bg-white/5 hover:text-white",
                                "block rounded-md px-3 py-2 text-base font-medium"
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
