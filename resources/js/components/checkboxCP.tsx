import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Checkbox } from "./ui/checkbox";

interface CheckboxCPProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
}

export default function CheckboxCP({ checked, onChange }: CheckboxCPProps) {
    return (
        <FieldGroup className="w-full">
            <Field
                orientation="horizontal"
                className="flex items-start gap-3 rounded-lg bg-[#f2c879] px-4 py-3"
            >
                <Checkbox
                    id="edit-price-checkbox"
                    name="edit-price-checkbox"
                    checked={checked}
                    onCheckedChange={(value) => onChange(value === true)}
                />
                <FieldContent>
                    <FieldLabel htmlFor="edit-price-checkbox">
                        Edit cost price dan sell price
                    </FieldLabel>
                    <FieldDescription>
                        Centang jika harga produk memang perlu diubah.
                    </FieldDescription>
                </FieldContent>
            </Field>
        </FieldGroup>
    );
}
