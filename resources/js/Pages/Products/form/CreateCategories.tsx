import ProductModal from "./ProductModal";
import ProductForm from "./ProductForm";
import { useForm, usePage } from "@inertiajs/react";
import { UnitsProps } from "@/types";
import { toast } from "sonner";
import CategoriesForm from "./CategoriesForm";
interface CreateProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreateCategories({ isOpen, onClose }: CreateProps) {
    const categories = usePage().props.categories as any;

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
        <ProductModal
            isOpen={isOpen}
            onClose={onClose}
            reset={reset}
            title="CREATE CATEGORIES"
            subtitle="> FILL ALL FIELDS <"
        >
            <form onSubmit={handleSubmit}>
                <CategoriesForm
                    data={data}
                    setData={setData}
                    reset={reset}
                    processing={processing}
                    errors={errors}
                    // units={units}
                    onClose={onClose}
                />

                {/* tombol Save & Cancel */}
            </form>
        </ProductModal>
    );
}
