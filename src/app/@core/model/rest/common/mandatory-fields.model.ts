import { KeyValueModel } from "./key-value.model";

export interface MandatoryFields {
    fieldId: number;
    name: string;
    description: string;
    validation: string;
    type: string;
    label: string;
    items: KeyValueModel[];
}
