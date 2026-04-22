import EntityCrudPage from "../components/EntityCrudPage";
import { brandService } from "../api/services";

const fields = [
  { name: "name", label: "Name", required: true },
  { name: "logo", label: "Logo URL/Name" },
  { name: "banner", label: "Banner URL/Name" },
  { name: "description", label: "Description", type: "textarea" },
  { name: "website", label: "Website URL" },
  { name: "country", label: "Country" },
  { name: "displayOrder", label: "Display Order", type: "number" },
  { name: "isFeatured", label: "Is Featured", type: "checkbox", defaultValue: false },
  { name: "isActive", label: "Is Active", type: "checkbox", defaultValue: true },
  { name: "metaTitle", label: "Meta Title" },
  { name: "metaDescription", label: "Meta Description", type: "textarea" },
];

const columns = [
  { key: "name", label: "Name" },
  { key: "slug", label: "Slug" },
  { key: "country", label: "Country" },
  { key: "isActive", label: "Active" },
];

const BrandsPage = () => (
  <EntityCrudPage title="Brands" service={brandService} fields={fields} columns={columns} />
);

export default BrandsPage;
