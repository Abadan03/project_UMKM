import {
    Field,
    FieldContent,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Checkbox } from "./ui/checkbox";

interface CheckboxCPProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
}

export default function Notes() {
    return (
        <FieldGroup className="w-full">
            <Field
                orientation="horizontal"
                className="flex items-start gap-3 rounded-lg bg-[#f2c879] px-4 py-3"
            >
                <FieldContent>
                    <FieldLabel htmlFor="edit-price-checkbox">
                        Tambahkan Categories agar anda dapat menambahkan{" "}
                        <strong>produk</strong>
                    </FieldLabel>
                    <FieldDescription>
                        Contoh categories
                        <br />
                        Nama : Makanan
                        <br />
                        deskripsi: (opsional) ...kategori makanan
                    </FieldDescription>
                </FieldContent>
            </Field>
        </FieldGroup>
    );
}
