import ProductModal from "./ProductModal";
import ProductForm from "./ProductForm";
import { useForm, usePage } from "@inertiajs/react";
import { ProductProps, UnitsProps } from "@/types";
import { toast } from "sonner";
interface CreateProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Create({ isOpen, onClose }: CreateProps) {
    const units = usePage().props.units as UnitsProps[];
    const categories = usePage().props.categories as ProductProps[];
    const testing = usePage();

    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        qty: 0,
        unit_id: "",
        categories_id: "",
        cost_price: "",
        sell_price: "",
        description: "",
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        post("/products/store", {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onClose();
                toast.success("Product created successfully.");
            },
        });
    }

    return (
        <ProductModal
            isOpen={isOpen}
            onClose={onClose}
            reset={reset}
            title="CREATE PRODUCT"
            subtitle="> FILL ALL FIELDS <"
        >
            <form onSubmit={handleSubmit}>
                <ProductForm
                    data={data}
                    setData={setData}
                    reset={reset}
                    processing={processing}
                    errors={errors}
                    units={units}
                    onClose={onClose}
                    categories={categories}
                />

                {/* tombol Save & Cancel */}
            </form>
        </ProductModal>
    );
}
