import EntityCrudPage from "../components/EntityCrudPage";
import { reviewService } from "../api/services";

const fields = [
  { name: "title", label: "Title" },
  { name: "text", label: "Text", type: "textarea", required: true },
  { name: "productId", label: "Product Id", required: true },
  { name: "userId", label: "User Id", required: true },
  { name: "rate", label: "Rate", type: "number", defaultValue: 5 },
  { name: "isActive", label: "Is Active", type: "checkbox", defaultValue: true },
];

const columns = [
  { key: "title", label: "Title" },
  { key: "rate", label: "Rate" },
  {
    key: "userId",
    label: "User",
    render: (item) => item.userId?.name || item.userId || "-",
  },
  { key: "isActive", label: "Active" },
];

const ReviewsPage = () => (
  <EntityCrudPage title="Reviews" service={reviewService} fields={fields} columns={columns} />
);

export default ReviewsPage;
