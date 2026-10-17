import CategoriesModal from "./CategoriesModal";
import { useForm, usePage } from "@inertiajs/react";
import { toast } from "sonner";
import CreateCategory from "./CreateCategoryForm";
import ListCategory from "./ListCategory";
import type { CategoriesProps, PaginationProps } from "@/types";
interface CreateProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreateCategories({ isOpen, onClose }: CreateProps) {
    const categories = usePage().props
        .categories as PaginationProps<CategoriesProps>;

    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        description: "",
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        post("/categories/store", {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onClose();
                toast.success("Categories created successfully.");
            },
        });
    }

    return (
        <CategoriesModal
            isOpen={isOpen}
            onClose={onClose}
            title="CREATE CATEGORIES"
            subtitle="> FILL ALL FIELDS <"
            createContent={
                <form onSubmit={handleSubmit}>
                    <CreateCategory
                        data={data}
                        setData={setData}
                        reset={reset}
                        processing={processing}
                        errors={errors}
                        onClose={onClose}
                    />
                </form>
            }
            listContent={<ListCategory categories={categories.data} />}
        />
    );
}
