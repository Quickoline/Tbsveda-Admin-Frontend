import { useEffect, useState } from "react";
import { orderService } from "../api/services";

const emptyOrderForm = {
  user: "",
  orderItems: '[{"product":"","title":"","quantity":1,"price":0}]',
  shippingAddress:
    '{"fullName":"","phone":"","addressLine":"","city":"","state":"","pincode":"","country":"India"}',
  itemsPrice: 0,
  taxPrice: 0,
  shippingPrice: 0,
  discountPrice: 0,
  totalPrice: 0,
  paymentMethod: "COD",
  orderStatus: "PLACED",
};

const statusOptions = [
  "PLACED",
  "CONFIRMED",
  "PACKED",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
  "RETURN_REQUESTED",
  "RETURNED",
  "REFUNDED",
];

const parseJsonSafe = (value, fallback) => {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const normalizeRows = (result) => {
  if (Array.isArray(result)) return result;
  if (Array.isArray(result?.data)) return result.data;
  return [];
};

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyOrderForm);

  const loadOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await orderService.list();
      setOrders(normalizeRows(data));
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const createOrder = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await orderService.create({
        ...form,
        itemsPrice: Number(form.itemsPrice),
        taxPrice: Number(form.taxPrice),
        shippingPrice: Number(form.shippingPrice),
        discountPrice: Number(form.discountPrice),
        totalPrice: Number(form.totalPrice),
        orderItems: parseJsonSafe(form.orderItems, []),
        shippingAddress: parseJsonSafe(form.shippingAddress, {}),
      });
      setForm(emptyOrderForm);
      await loadOrders();
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    }
  };

  const updateStatus = async (orderId, orderStatus) => {
    try {
      await orderService.update(orderId, { orderStatus });
      await loadOrders();
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    }
  };

  const assignDelivery = async (orderId) => {
    const deliveryPartner = window.prompt("Delivery partner:");
    const trackingId = window.prompt("Tracking ID:");
    const expectedDeliveryDate = window.prompt("Expected date (YYYY-MM-DD):");
    if (!deliveryPartner || !trackingId || !expectedDeliveryDate) return;

    try {
      await orderService.assignDelivery(orderId, {
        deliveryPartner,
        trackingId,
        expectedDeliveryDate,
      });
      await loadOrders();
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    }
  };

  const updateExpectedDelivery = async (orderId) => {
    const expectedDeliveryDate = window.prompt("Expected date (YYYY-MM-DD):");
    if (!expectedDeliveryDate) return;
    try {
      await orderService.updateExpectedDelivery(orderId, { expectedDeliveryDate });
      await loadOrders();
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    }
  };

  const deleteOrder = async (orderId) => {
    if (!window.confirm("Delete this order?")) return;
    try {
      await orderService.remove(orderId);
      await loadOrders();
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    }
  };

  return (
    <section>
      <div className="page-head">
        <h1>Orders</h1>
        <button onClick={loadOrders}>Refresh</button>
      </div>
      {error && <p className="error">{error}</p>}

      <div className="grid-two">
        <form className="card form-grid" onSubmit={createOrder}>
          <h3>Create Order</h3>
          <label>
            User Id
            <input
              value={form.user}
              onChange={(e) => setForm((prev) => ({ ...prev, user: e.target.value }))}
              required
            />
          </label>
          <label>
            Order Items JSON
            <textarea
              rows={5}
              value={form.orderItems}
              onChange={(e) => setForm((prev) => ({ ...prev, orderItems: e.target.value }))}
            />
          </label>
          <label>
            Shipping Address JSON
            <textarea
              rows={5}
              value={form.shippingAddress}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, shippingAddress: e.target.value }))
              }
            />
          </label>
          <label>
            Items Price
            <input
              type="number"
              value={form.itemsPrice}
              onChange={(e) => setForm((prev) => ({ ...prev, itemsPrice: e.target.value }))}
              required
            />
          </label>
          <label>
            Tax Price
            <input
              type="number"
              value={form.taxPrice}
              onChange={(e) => setForm((prev) => ({ ...prev, taxPrice: e.target.value }))}
            />
          </label>
          <label>
            Shipping Price
            <input
              type="number"
              value={form.shippingPrice}
              onChange={(e) => setForm((prev) => ({ ...prev, shippingPrice: e.target.value }))}
            />
          </label>
          <label>
            Discount Price
            <input
              type="number"
              value={form.discountPrice}
              onChange={(e) => setForm((prev) => ({ ...prev, discountPrice: e.target.value }))}
            />
          </label>
          <label>
            Total Price
            <input
              type="number"
              value={form.totalPrice}
              onChange={(e) => setForm((prev) => ({ ...prev, totalPrice: e.target.value }))}
              required
            />
          </label>
          <label>
            Payment Method
            <input
              value={form.paymentMethod}
              onChange={(e) => setForm((prev) => ({ ...prev, paymentMethod: e.target.value }))}
              required
            />
          </label>
          <button type="submit">Create Order</button>
        </form>

        <div className="card table-wrap">
          <h3>Order List</h3>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>User</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order.invoiceNumber || "-"}</td>
                    <td>{order.user?.email || order.user || "-"}</td>
                    <td>{order.totalPrice}</td>
                    <td>
                      <select
                        value={order.orderStatus}
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>{order.paymentMethod}</td>
                    <td className="row">
                      <button className="secondary" onClick={() => assignDelivery(order._id)}>
                        Assign Delivery
                      </button>
                      <button
                        className="secondary"
                        onClick={() => updateExpectedDelivery(order._id)}
                      >
                        Update Expected
                      </button>
                      <button className="danger" onClick={() => deleteOrder(order._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {!orders.length && (
                  <tr>
                    <td colSpan={6}>No orders found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  );
};

export default OrdersPage;
