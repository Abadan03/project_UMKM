import ProductModal from "./ProductModal";
import ProductForm from "./ProductForm";
import { useForm, usePage } from "@inertiajs/react";
import { ProductProps, UnitsProps } from "@/types";
import { toast } from "sonner";
import { useEffect } from "react";

interface EditProps {
    isOpen: boolean;
    onClose: () => void;
    product: ProductProps | null;
}

export default function Edit({ product, isOpen, onClose }: EditProps) {
    const units = usePage().props.units as UnitsProps[];

    const { data, setData, post, processing, errors, reset } = useForm({
        name: product?.name ?? "",
        qty: product?.qty ?? "",
        unit_id: product?.unit_id?.toString() ?? "",
        pricing: product?.pricing ?? "",
        description: product?.description ?? "",
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        post(`/products/update/${product?.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onClose();
                toast.success("Update product successfully.");
            },
        });
    }

    useEffect(() => {
        if (product) {
            setData({
                name: product.name,
                qty: product.qty.toString(),
                unit_id: product.unit_id.toString(),
                pricing: product.pricing.toString(),
                description: product.description ?? "",
            });
        }
    }, [product]);

    return (
        <ProductModal
            isOpen={isOpen}
            onClose={onClose}
            reset={reset}
            title="UPDATE PRODUCT"
            subtitle="> FILL ALL FIELDS <"
        >
            <form onSubmit={handleSubmit}>
                <ProductForm
                    data={data}
                    setData={setData}
                    processing={processing}
                    errors={errors}
                    units={units}
                    onClose={onClose}
                    reset={reset}
                />

                {/* tombol Save & Cancel */}
            </form>
        </ProductModal>
    );
}
