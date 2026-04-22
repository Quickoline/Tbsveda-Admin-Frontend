import EntityCrudPage from "../components/EntityCrudPage";
import { couponService } from "../api/services";

const fields = [
  { name: "code", label: "Code", required: true },
  { name: "description", label: "Description", type: "textarea" },
  { name: "discountType", label: "Discount Type (percentage/fixed)", defaultValue: "percentage" },
  { name: "discountValue", label: "Discount Value", type: "number", required: true },
  { name: "minOrderValue", label: "Min Order Value", type: "number" },
  { name: "maxDiscount", label: "Max Discount", type: "number" },
  { name: "isNewUserOnly", label: "New User Only", type: "checkbox", defaultValue: false },
  { name: "usageLimit", label: "Usage Limit", type: "number" },
  { name: "usageLimitPerUser", label: "Usage/User", type: "number", defaultValue: 1 },
  { name: "validFrom", label: "Valid From", type: "datetime-local" },
  { name: "expires", label: "Expires", type: "datetime-local", required: true },
  {
    name: "applicableCategories",
    label: "Applicable Category Ids JSON",
    type: "json",
    defaultValue: "[]",
  },
  {
    name: "applicableProducts",
    label: "Applicable Product Ids JSON",
    type: "json",
    defaultValue: "[]",
  },
  { name: "isActive", label: "Is Active", type: "checkbox", defaultValue: true },
];

const columns = [
  { key: "code", label: "Code" },
  { key: "discountType", label: "Type" },
  { key: "discountValue", label: "Value" },
  { key: "isActive", label: "Active" },
];

const CouponsPage = () => (
  <EntityCrudPage title="Coupons" service={couponService} fields={fields} columns={columns} />
);

export default CouponsPage;
