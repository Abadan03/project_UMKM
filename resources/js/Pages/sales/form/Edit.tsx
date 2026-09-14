import SalesModal from "./SalesModal";
import SalesForm from "./SalesForm";
import { useForm, usePage } from "@inertiajs/react";
import { SalesProps, UnitsProps } from "@/types";
import { toast } from "sonner";
import { useEffect } from "react";

interface EditProps {
    isOpen: boolean;
    onClose: () => void;
    sales: SalesProps | null;
}

export default function Edit({ sales, isOpen, onClose }: EditProps) {
    const units = usePage().props.units as UnitsProps[];

    const { data, setData, put, processing, errors, reset } = useForm({
        customer_name: sales?.cashier_name ?? "",
        subtotal: sales?.subtotal ?? 0,
        discount: sales?.discount ?? 0,
        tax: sales?.tax ?? 0,
        transaction_date: sales?.transaction_date ?? "",
        notes: sales?.notes ?? "",
        items:
            sales?.items?.map((item) => ({
                product_id: item.product_id,
                quantity: item.quantity,
                unit_price: item.unit_price,
                discount: item.discount ?? 0,
                subtotal: item.subtotal,
            })) ?? [],
        transactions: sales?.transactions?.[0]
            ? {
                  transaction_type: sales.transactions[0].transaction_type,
                  amount: sales.transactions[0].amount ?? 0,
                  payment_method: sales.transactions[0].payment_method,
                  reference_number:
                      sales.transactions[0].reference_number ?? "",
                  processed_at: sales.transactions[0].processed_at ?? "",
                  status: sales.transactions[0].status,
              }
            : {
                  transaction_type: "",
                  amount: 0,
                  payment_method: "",
                  reference_number: "",
                  processed_at: "",
                  status: "",
              },
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        put(`/sales/update/${sales?.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onClose();
                toast.success("Update sales successfully.");
            },
        });
    }

    useEffect(() => {
        if (sales) {
            setData({
                customer_name: sales.cashier_name,
                subtotal: sales.subtotal,
                discount: sales.discount,
                tax: sales.tax,
                transaction_date: sales.transaction_date,
                items:
                    sales?.items?.map((item) => ({
                        product_id: item.product_id,
                        quantity: item.quantity,
                        unit_price: item.unit_price,
                        discount: item.discount ?? 0,
                        subtotal: item.subtotal,
                    })) ?? [],
                transactions: sales?.transactions?.[0]
                    ? {
                          transaction_type:
                              sales.transactions[0].transaction_type,
                          amount: sales.transactions[0].amount ?? 0,
                          payment_method: sales.transactions[0].payment_method,
                          reference_number:
                              sales.transactions[0].reference_number ?? "",
                          processed_at:
                              sales.transactions[0].processed_at ?? "",
                          status: sales.transactions[0].status,
                      }
                    : {
                          transaction_type: "",
                          amount: 0,
                          payment_method: "",
                          reference_number: "",
                          processed_at: "",
                          status: "",
                      },
            });
        }
    }, [sales]);

    return (
        <SalesModal
            isOpen={isOpen}
            onClose={onClose}
            title={`UPDATE Sales ${sales?.invoice_number ?? ""}`}
        >
            <form onSubmit={handleSubmit}>
                <SalesForm
                    data={data}
                    setData={setData}
                    processing={processing}
                    errors={errors}
                    onClose={onClose}
                />

                {/* tombol Save & Cancel */}
            </form>
        </SalesModal>
    );
}
