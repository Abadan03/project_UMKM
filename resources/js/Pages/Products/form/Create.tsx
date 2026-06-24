import ProductModal from "./ProductModal";
import ProductForm from "./ProductForm";
import { useForm, usePage } from "@inertiajs/react";
import { UnitsProps } from "@/types";
import { toast } from "sonner";
interface CreateProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Create({ isOpen, onClose }: CreateProps) {
    const units = usePage().props.units as UnitsProps[];

    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        qty: "",
        unit_id: "",
        pricing: "",
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
                />

                {/* tombol Save & Cancel */}
            </form>
        </ProductModal>
    );
}
