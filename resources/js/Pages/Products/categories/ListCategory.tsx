import type { CategoriesProps } from "@/types";

interface ListCategoryProps {
    categories: CategoriesProps[];
}

export default function ListCategory({ categories }: ListCategoryProps) {
    return (
        <div className="px-4 py-5 grid grid-cols-2 gap-3 max-h-80 overflow-y-auto">
            {categories.length === 0 ? (
                <p className="font-mono text-xs text-[#8b93a7]">
                    No categories found.
                </p>
            ) : (
                categories.map((category) => (
                    <div
                        key={category.id}
                        className="bg-[#1c2230] px-3 py-2"
                        style={{
                            border: "3px solid #11151f",
                            boxShadow: "3px 3px 0 #11151f",
                        }}
                    >
                        <h3 className="font-mono text-xs font-bold text-[#5fa080]">
                            {category.name}
                        </h3>
                        <p className="mt-1 font-mono text-[10px] text-[#c3c9d4]">
                            {category.description || "No description"}
                        </p>
                    </div>
                ))
            )}
        </div>
    );
}
