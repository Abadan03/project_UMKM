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

    const { data, setData, put, processing, errors, reset } = useForm({
        name: product?.name ?? "",
        qty: product?.qty ?? 0,
        unit_id: product?.unit_id?.toString() ?? "",
        cost_price: product?.cost_price ?? "",
        sell_price: product?.sell_price ?? "",
        description: product?.description ?? "",
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        put(`/products/update/${product?.id}`, {
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
                qty: product.qty,
                unit_id: product.unit_id.toString(),
                cost_price: product.cost_price.toString(),
                sell_price: product.sell_price.toString(),
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
