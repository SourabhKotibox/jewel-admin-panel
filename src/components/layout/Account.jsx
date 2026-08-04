import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  userLogin,
  userRegister,
  logoutCustomer,
  clearAuthError,
  fetchUserMe,
  updateCustomerProfile,
} from "../../store/redux/slices/authSlice";
import { api, assetUrl } from "../../api/client";
import useCmsPage from "../../hooks/useCmsPage";
import CmsCustomBlock from "../CmsCustomBlock";
import useWishlistStore from "../../store/useWishlistStore";
import useAddressStore from "../../store/useAddressStore";
import ProductCard from "../product/ProductCard";
import OrderChat from "../OrderChat";
import { formatPrice } from "../../data";
import { MapPin, Package, Heart, User, Truck, RotateCcw } from "lucide-react";
import SeoHead from "../SeoHead";

const field =
  "w-full bg-ivory border border-champagne/30 px-4 py-3 text-sm outline-none focus:border-champagne transition-colors placeholder:text-noir/35";
const label = "block text-[10px] uppercase tracking-widest2 text-noir/45 mb-1.5";

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "orders", label: "Orders", icon: Package },
  { id: "addresses", label: "Addresses", icon: MapPin },
  { id: "returns", label: "Returns", icon: RotateCcw },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "track", label: "Track order", icon: Truck },
];

export default function Account() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { customer, customerToken, loading, error } = useSelector((s) => s.auth);
  const { fields: c, isHidden, customSections } = useCmsPage("account");
  const [mode, setMode] = useState("login");
  const [forgotMsg, setForgotMsg] = useState("");
  const [pwForm, setPwForm] = useState({ currentPassword: "", password: "", confirm: "" });
  const [pwMsg, setPwMsg] = useState("");
  const [orders, setOrders] = useState([]);
  const [returns, setReturns] = useState([]);
  const [chatOrder, setChatOrder] = useState(null);
  const [returnOrder, setReturnOrder] = useState(null);
  const [returnReason, setReturnReason] = useState("");
  const [returnMsg, setReturnMsg] = useState("");
  const [tab, setTab] = useState(searchParams.get("tab") || "profile");
  const wishlistItems = useWishlistStore((s) => s.items);
  const syncWishlist = useWishlistStore((s) => s.syncFromServer);
  const addresses = useAddressStore((s) => s.addresses);
  const addAddress = useAddressStore((s) => s.addAddress);
  const removeAddress = useAddressStore((s) => s.removeAddress);
  const setDefault = useAddressStore((s) => s.setDefault);
  const syncFromApi = useAddressStore((s) => s.syncFromApi);
  const [addrForm, setAddrForm] = useState({
    label: "Home",
    name: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pinCode: "",
  });
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    city: "",
    address: "",
    state: "",
    pinCode: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [profileForm, setProfileForm] = useState({
    name: "",
    phone: "",
    city: "",
    address: "",
  });
  const [profileSaved, setProfileSaved] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const updateAddress = useAddressStore((s) => s.updateAddress);

  useEffect(() => {
    if (customerToken) dispatch(fetchUserMe());
  }, [customerToken, dispatch]);

  useEffect(() => {
    if (!customer) return;
    setProfileForm({
      name: customer.name || "",
      phone: customer.phone || "",
      city: customer.city || "",
      address: customer.address || "",
    });
  }, [customer]);

  useEffect(() => {
    if (!customerToken) return;
    syncFromApi();
    syncWishlist();
    api("/orders/mine", { portal: "user" })
      .then((rows) => setOrders(Array.isArray(rows) ? rows : []))
      .catch(() => setOrders([]));
    api("/returns/mine", { portal: "user" })
      .then((rows) => setReturns(Array.isArray(rows) ? rows : []))
      .catch(() => setReturns([]));
  }, [customerToken, syncFromApi, syncWishlist]);

  useEffect(() => {
    const t = searchParams.get("tab");
    if (t && TABS.some((x) => x.id === t)) setTab(t);
  }, [searchParams]);

  const selectTab = (id) => {
    setTab(id);
    setSearchParams({ tab: id });
  };

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submitLogin = async (e) => {
    e.preventDefault();
    dispatch(clearAuthError());
    const result = await dispatch(
      userLogin({ email: form.email, password: form.password })
    );
    if (userLogin.fulfilled.match(result)) {
      setForm((f) => ({ ...f, password: "" }));
    }
  };

  const submitRegister = async (e) => {
    e.preventDefault();
    dispatch(clearAuthError());
    const result = await dispatch(
      userRegister({
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        city: form.city,
        address: form.address,
        state: form.state,
        pinCode: form.pinCode,
        avatarFile: avatarFile || undefined,
      })
    );
    if (userRegister.fulfilled.match(result)) {
      setForm((f) => ({ ...f, password: "" }));
      setAvatarFile(null);
    }
  };

  const saveAddress = async (e) => {
    e.preventDefault();
    const payload = {
      ...addrForm,
      name: addrForm.name || customer?.name,
      isDefault: addresses.length === 0,
    };
    if (editingAddressId) {
      await updateAddress(editingAddressId, payload);
      setEditingAddressId(null);
    } else {
      await addAddress(payload);
    }
    setAddrForm({
      label: "Home",
      name: customer?.name || "",
      phone: customer?.phone || "",
      line1: "",
      line2: "",
      city: "",
      state: "",
      pinCode: "",
    });
  };

  const submitReturn = async (e) => {
    e.preventDefault();
    if (!returnOrder || !returnReason.trim()) return;
    setReturnMsg("");
    try {
      const row = await api("/returns", {
        method: "POST",
        body: {
          orderNumber: returnOrder.orderNumber || returnOrder.id,
          reason: returnReason.trim(),
          type: "Return",
          amount: returnOrder.total,
        },
        portal: "user",
      });
      setReturns((prev) => [row, ...prev]);
      setReturnOrder(null);
      setReturnReason("");
      setReturnMsg("Return request submitted.");
      setTab("returns");
      setSearchParams({ tab: "returns" });
    } catch (err) {
      setReturnMsg(err.message || "Could not submit return");
    }
  };

  const startEditAddress = (a) => {
    setEditingAddressId(a.id);
    setAddrForm({
      label: a.label || "Home",
      name: a.name || "",
      phone: a.phone || "",
      line1: a.line1 || "",
      line2: a.line2 || "",
      city: a.city || "",
      state: a.state || "",
      pinCode: a.pinCode || "",
    });
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    dispatch(clearAuthError());
    const result = await dispatch(updateCustomerProfile(profileForm));
    if (updateCustomerProfile.fulfilled.match(result)) {
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2000);
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    setPwMsg("");
    dispatch(clearAuthError());
    if (pwForm.password !== pwForm.confirm) {
      setPwMsg("New passwords do not match");
      return;
    }
    const result = await dispatch(
      updateCustomerProfile({
        currentPassword: pwForm.currentPassword,
        password: pwForm.password,
      })
    );
    if (updateCustomerProfile.fulfilled.match(result)) {
      setPwMsg("Password updated");
      setPwForm({ currentPassword: "", password: "", confirm: "" });
    }
  };

  const submitForgot = async (e) => {
    e.preventDefault();
    setForgotMsg("");
    dispatch(clearAuthError());
    try {
      const res = await api("/auth/user/forgot-password", {
        method: "POST",
        body: { email: form.email },
        portal: "user",
      });
      setForgotMsg(
        res.resetLink
          ? `${res.message} Dev link: ${res.resetLink}`
          : res.message || "Check your email for a reset link."
      );
    } catch (err) {
      setForgotMsg(err.message || "Could not send reset email");
    }
  };

  if (customer && customerToken) {
    return (
      <div className="bg-ivory min-h-screen">
        <SeoHead title="My Account" />
        <div className="container-luxe py-12 md:py-20">
          {!isHidden("header") && (
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow mb-2">Welcome back</p>
                <h1 className="heading-display text-3xl md:text-4xl text-noir">
                  {customer.name}
                </h1>
                <p className="text-noir/55 text-sm mt-1">{customer.email}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link to="/track-order" className="btn-outline !py-2.5 !px-5 text-[11px]">
                  Track order
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    dispatch(logoutCustomer());
                    navigate("/account");
                  }}
                  className="btn-outline !py-2.5 !px-5 text-[11px]"
                >
                  Sign out
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2 border-b border-champagne/15 mb-8">
            {TABS.map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => selectTab(t.id)}
                  className={`inline-flex items-center gap-2 px-4 py-3 text-[11px] uppercase tracking-widest2 border-b-2 -mb-px transition-colors ${
                    active
                      ? "border-champagne text-noir"
                      : "border-transparent text-noir/45 hover:text-noir"
                  }`}
                >
                  <Icon size={14} />
                  {t.id === "orders"
                    ? c.ordersTab || t.label
                    : t.id === "profile"
                    ? c.profileTab || t.label
                    : t.id === "addresses"
                    ? c.addressesTab || t.label
                    : t.label}
                  {t.id === "wishlist" && wishlistItems.length > 0 && (
                    <span className="text-[10px] text-champagne-dark">({wishlistItems.length})</span>
                  )}
                </button>
              );
            })}
          </div>

          {tab === "profile" && (
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
              <form onSubmit={saveProfile} className="border border-champagne/20 bg-white p-6 space-y-4">
                <h2 className="heading-display text-xl text-noir">Edit profile</h2>
                {(customer.joined || customer.createdAt) && (
                  <p className="text-xs text-noir/45">
                    Member since{" "}
                    <span className="text-noir/70">
                      {customer.joined ||
                        new Date(customer.createdAt).toISOString().slice(0, 10)}
                    </span>
                  </p>
                )}
                <div>
                  <label className={label}>Email (read-only)</label>
                  <input className={`${field} opacity-70`} value={customer.email || ""} disabled />
                </div>
                {[
                  ["name", "Full name"],
                  ["phone", "Phone"],
                  ["city", "City"],
                  ["address", "Address"],
                ].map(([key, lab]) => (
                  <div key={key}>
                    <label className={label}>{lab}</label>
                    <input
                      className={field}
                      value={profileForm[key]}
                      onChange={(e) => setProfileForm({ ...profileForm, [key]: e.target.value })}
                      required={key === "name"}
                    />
                  </div>
                ))}
                {error && <p className="text-sm text-rose-600">{error}</p>}
                <button type="submit" className="btn-gold !py-3" disabled={loading}>
                  {profileSaved ? "Saved" : loading ? "Saving…" : "Save profile"}
                </button>
              </form>
              <form onSubmit={savePassword} className="border border-champagne/20 bg-white p-6 space-y-4">
                <h2 className="heading-display text-xl text-noir">Change password</h2>
                <div>
                  <label className={label}>Current password</label>
                  <input
                    type="password"
                    required
                    className={field}
                    value={pwForm.currentPassword}
                    onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
                  />
                </div>
                <div>
                  <label className={label}>New password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    className={field}
                    value={pwForm.password}
                    onChange={(e) => setPwForm({ ...pwForm, password: e.target.value })}
                  />
                </div>
                <div>
                  <label className={label}>Confirm new password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    className={field}
                    value={pwForm.confirm}
                    onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })}
                  />
                </div>
                {pwMsg && <p className="text-sm text-champagne-dark">{pwMsg}</p>}
                {error && <p className="text-sm text-rose-600">{error}</p>}
                <button type="submit" className="btn-outline !py-3" disabled={loading}>
                  Update password
                </button>
              </form>
              <div className="border border-champagne/20 bg-white p-6 space-y-4 h-fit md:col-span-2 lg:col-span-1">
                <h2 className="heading-display text-xl text-noir">Quick links</h2>
                <div className="flex flex-col gap-3 text-sm">
                  <Link to="/account?tab=orders" className="link-underline text-champagne-dark w-fit">
                    Previous orders ({orders.length})
                  </Link>
                  <Link to="/account?tab=addresses" className="link-underline text-champagne-dark w-fit">
                    Manage addresses ({addresses.length})
                  </Link>
                  <Link to="/wishlist" className="link-underline text-champagne-dark w-fit">
                    Wishlist ({wishlistItems.length})
                  </Link>
                  <Link to="/track-order" className="link-underline text-champagne-dark w-fit">
                    Track an order
                  </Link>
                  <Link to="/shop" className="link-underline text-champagne-dark w-fit">
                    Continue shopping
                  </Link>
                </div>
              </div>
            </div>
          )}

          {tab === "orders" && (
            <div className="max-w-4xl">
              <h2 className="heading-display text-2xl text-noir mb-6">{c.ordersTab || "Your orders"}</h2>
              {orders.length === 0 ? (
                <div className="text-center py-12 border border-champagne/15 bg-white/50">
                  <p className="text-sm text-noir/50 mb-4">No orders yet.</p>
                  <Link to="/shop" className="btn-gold !py-3">
                    Start shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((o) => (
                    <div
                      key={o.id || o._id}
                      className="border border-champagne/15 bg-white p-5 md:p-6"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                        <div>
                          <p className="text-[10px] uppercase tracking-widest2 text-noir/40">Order</p>
                          <p className="font-display text-xl text-noir">{o.orderNumber || o.id}</p>
                          <p className="text-xs text-noir/45 mt-1">
                            {o.createdAt
                              ? new Date(o.createdAt).toLocaleString()
                              : o.date || "—"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-champagne-dark">{o.status}</p>
                          <p className="text-xs text-noir/50 mt-1">
                            {o.payment}
                            {o.paymentMethod ? ` · ${o.paymentMethod}` : ""}
                          </p>
                          <p className="text-sm font-medium text-noir mt-2">
                            {formatPrice(Number(o.total || 0))}
                          </p>
                        </div>
                      </div>
                      <ul className="space-y-2 text-sm text-noir/65 border-t border-champagne/10 pt-3 mb-4">
                        {(o.items || []).map((item, idx) => (
                          <li key={idx} className="flex items-center justify-between gap-3">
                            <span className="flex items-center gap-2 min-w-0">
                              {item.image ? (
                                <img
                                  src={assetUrl(item.image)}
                                  alt=""
                                  className="w-10 h-10 rounded object-cover bg-stone-100 shrink-0"
                                />
                              ) : null}
                              <span className="truncate">
                                {item.name} × {item.qty || 1}
                              </span>
                            </span>
                            <span className="shrink-0">{formatPrice((item.price || 0) * (item.qty || 1))}</span>
                          </li>
                        ))}
                      </ul>
                      {(o.discount > 0 || o.tax > 0 || o.balanceDue > 0) && (
                        <div className="text-xs text-noir/50 space-y-1 mb-4">
                          {o.couponCode && <p>Coupon: {o.couponCode}</p>}
                          {o.discount > 0 && <p>Discount: −{formatPrice(o.discount)}</p>}
                          {o.taxLabel && <p>Tax: {o.taxLabel}</p>}
                          {o.balanceDue > 0 && (
                            <p className="text-champagne-dark">
                              Balance due: {formatPrice(o.balanceDue)}
                            </p>
                          )}
                        </div>
                      )}
                      <div className="flex flex-wrap gap-3 mb-3">
                        <Link
                          to={`/track-order?order=${encodeURIComponent(o.orderNumber || o.id)}&email=${encodeURIComponent(customer.email || "")}`}
                          className="btn-outline !py-2.5 !px-4 text-[11px]"
                        >
                          Track
                        </Link>
                        <button
                          type="button"
                          onClick={() =>
                            setChatOrder(
                              chatOrder === (o.orderNumber || o.id) ? null : o.orderNumber || o.id
                            )
                          }
                          className="btn-outline !py-2.5 !px-4 text-[11px]"
                        >
                          {chatOrder === (o.orderNumber || o.id) ? "Hide chat" : "Inquire / chat"}
                        </button>
                        {["Delivered", "Shipped"].includes(o.status) && o.payment !== "Refunded" && (
                          <button
                            type="button"
                            onClick={() => {
                              setReturnOrder(o);
                              setReturnReason("");
                              setReturnMsg("");
                            }}
                            className="text-[11px] uppercase tracking-widest2 text-champagne-dark self-center"
                          >
                            Request return / refund
                          </button>
                        )}
                        {o.awb && (
                          <Link
                            to={`/track-order?order=${encodeURIComponent(o.orderNumber || o.id)}&email=${encodeURIComponent(customer.email || "")}&awb=${encodeURIComponent(o.awb)}`}
                            className="text-[11px] uppercase tracking-widest2 text-champagne-dark self-center"
                          >
                            AWB {o.awb}
                          </Link>
                        )}
                      </div>
                      {chatOrder === (o.orderNumber || o.id) && (
                        <OrderChat
                          orderNumber={o.orderNumber || o.id}
                          portal="user"
                          title="Order support"
                        />
                      )}
                      {returnOrder && (returnOrder.orderNumber || returnOrder.id) === (o.orderNumber || o.id) && (
                        <form
                          onSubmit={submitReturn}
                          className="mt-4 border border-champagne/20 bg-champagne/5 p-4 space-y-3"
                        >
                          <p className="text-sm font-medium text-noir">Return / refund request</p>
                          <textarea
                            required
                            rows={3}
                            className={field}
                            placeholder="Reason (size issue, damage, change of mind…)"
                            value={returnReason}
                            onChange={(e) => setReturnReason(e.target.value)}
                          />
                          <div className="flex flex-wrap gap-2">
                            <button type="submit" className="btn-gold !py-2.5 !px-5 text-[11px]">
                              Submit request
                            </button>
                            <button
                              type="button"
                              className="btn-outline !py-2.5 !px-5 text-[11px]"
                              onClick={() => setReturnOrder(null)}
                            >
                              Cancel
                            </button>
                          </div>
                          {returnMsg && <p className="text-xs text-rose-600">{returnMsg}</p>}
                        </form>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "returns" && (
            <div className="max-w-3xl">
              <h2 className="heading-display text-2xl text-noir mb-2">Returns & refunds</h2>
              <p className="text-sm text-noir/50 mb-6">
                Requests for delivered orders. Use order chat if you need help.
              </p>
              {returnMsg && !returnOrder && (
                <p className="text-sm text-champagne-dark mb-4">{returnMsg}</p>
              )}
              {returns.length === 0 ? (
                <p className="text-sm text-noir/50 border border-champagne/15 p-8 text-center">
                  No return requests yet. Open an order that is Shipped/Delivered to start one.
                </p>
              ) : (
                <div className="space-y-3">
                  {returns.map((r) => (
                    <div key={r.id || r._id} className="border border-champagne/15 bg-white p-5 text-sm">
                      <div className="flex justify-between gap-3">
                        <div>
                          <p className="font-medium text-noir">{r.returnNumber}</p>
                          <p className="text-xs text-noir/45 mt-1">Order {r.orderNumber}</p>
                        </div>
                        <p className="text-champagne-dark font-medium">{r.status}</p>
                      </div>
                      <p className="text-noir/60 mt-3">{r.reason}</p>
                      <p className="text-xs text-noir/40 mt-2">
                        {r.type} · {formatPrice(r.amount || 0)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "addresses" && (
            <div className="max-w-5xl">
              <h2 className="heading-display text-2xl text-noir mb-2">Addresses</h2>
              <p className="text-sm text-noir/50 mb-8">
                Save as many delivery addresses as you need (Home, Office, Family…). Set one as default for checkout.
              </p>
              <div className="grid lg:grid-cols-5 gap-8 items-start">
                <div className="lg:col-span-2 space-y-3">
                  {addresses.length === 0 ? (
                    <div className="border border-dashed border-champagne/30 bg-white/60 p-8 text-center">
                      <MapPin className="mx-auto text-champagne-dark mb-3" size={28} strokeWidth={1.25} />
                      <p className="text-sm text-noir/50">No saved addresses yet.</p>
                    </div>
                  ) : (
                    addresses.map((a) => (
                      <div
                        key={a.id}
                        className={`border bg-white p-5 text-sm relative ${
                          editingAddressId === a.id
                            ? "border-champagne"
                            : "border-champagne/15"
                        }`}
                      >
                        {a.isDefault && (
                          <span className="absolute top-4 right-4 text-[9px] uppercase tracking-widest2 text-champagne-dark border border-champagne/30 px-2 py-0.5">
                            Default
                          </span>
                        )}
                        <p className="text-[10px] uppercase tracking-widest2 text-noir/40 mb-1">
                          {a.label || "Address"}
                        </p>
                        <p className="font-medium text-noir">{a.name}</p>
                        <p className="text-noir/65 mt-2 leading-relaxed">
                          {a.line1}
                          {a.line2 ? `, ${a.line2}` : ""}
                          <br />
                          {a.city}, {a.state} {a.pinCode}
                          <br />
                          {a.phone}
                        </p>
                        <div className="flex flex-wrap gap-3 pt-4 mt-3 border-t border-champagne/10">
                          <button
                            type="button"
                            onClick={() => startEditAddress(a)}
                            className="text-[10px] uppercase tracking-widest2 text-champagne-dark"
                          >
                            Edit
                          </button>
                          {!a.isDefault && (
                            <button
                              type="button"
                              onClick={() => setDefault(a.id)}
                              className="text-[10px] uppercase tracking-widest2 text-noir/50"
                            >
                              Set default
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              if (editingAddressId === a.id) setEditingAddressId(null);
                              removeAddress(a.id);
                            }}
                            className="text-[10px] uppercase tracking-widest2 text-rose-600"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <form
                  onSubmit={saveAddress}
                  className="lg:col-span-3 border border-champagne/15 bg-white p-6 md:p-8"
                >
                  <h3 className="heading-display text-xl text-noir mb-6">
                    {editingAddressId ? "Edit address" : "Add new address"}
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      ["label", "Label", "sm:col-span-2"],
                      ["name", "Full name", "sm:col-span-2"],
                      ["phone", "Phone", ""],
                      ["pinCode", "PIN code", ""],
                      ["line1", "Address line 1", "sm:col-span-2"],
                      ["line2", "Address line 2 (optional)", "sm:col-span-2"],
                      ["city", "City", ""],
                      ["state", "State", ""],
                    ].map(([key, lab, span]) => (
                      <div key={key} className={span}>
                        <label className={label}>{lab}</label>
                        <input
                          className={field}
                          value={addrForm[key]}
                          onChange={(e) => setAddrForm({ ...addrForm, [key]: e.target.value })}
                          required={key !== "line2" && key !== "label"}
                          placeholder={lab}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-3 mt-6">
                    <button type="submit" className="btn-gold !py-3 !px-8">
                      {editingAddressId ? "Update address" : "Save address"}
                    </button>
                    {editingAddressId && (
                      <button
                        type="button"
                        className="btn-outline !py-3 !px-6"
                        onClick={() => {
                          setEditingAddressId(null);
                          setAddrForm({
                            label: "Home",
                            name: customer?.name || "",
                            phone: customer?.phone || "",
                            line1: "",
                            line2: "",
                            city: "",
                            state: "",
                            pinCode: "",
                          });
                        }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          )}

          {tab === "wishlist" && (
            <div>
              <h2 className="heading-display text-2xl text-noir mb-6">Wishlist</h2>
              {wishlistItems.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-sm text-noir/50 mb-4">No saved pieces yet.</p>
                  <Link to="/shop" className="btn-gold !py-3">
                    Browse collections
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {wishlistItems.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      image={product.images?.[0]}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "track" && (
            <div className="max-w-lg">
              <h2 className="heading-display text-2xl text-noir mb-3">Track an order</h2>
              <p className="text-sm text-noir/55 mb-6">
                Look up delivery status with your order number.
              </p>
              <Link to="/track-order" className="btn-gold !py-3.5">
                Open order tracker
              </Link>
            </div>
          )}
        </div>
        {customSections.map((s) => (
          <CmsCustomBlock key={s.id} data={s} />
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-ivory via-[#F7F4EE] to-ivory">
      <SeoHead title={mode === "register" ? "Register" : mode === "forgot" ? "Forgot Password" : "Sign In"} />
      <div className="container-luxe py-16 md:py-24">
        <div className="max-w-md mx-auto">
          {!isHidden("header") && (
            <div className="text-center mb-10">
              <p className="eyebrow mb-2">Client lounge</p>
              <h1 className="heading-display text-3xl md:text-4xl text-noir">
                {mode === "login" ? c.loginTitle || "Sign in" : c.registerTitle || "Create account"}
              </h1>
              <p className="text-sm text-noir/50 mt-2">
                Orders, addresses, wishlist, and order tracking in one place.
              </p>
            </div>
          )}

          {!isHidden("auth") && (
            <>
              <div className="flex border border-champagne/25 mb-8">
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setForgotMsg("");
                    dispatch(clearAuthError());
                  }}
                  className={`flex-1 py-3 text-[11px] uppercase tracking-widest2 transition-colors ${
                    mode === "login" || mode === "forgot"
                      ? "bg-noir text-champagne"
                      : "bg-white/70 text-noir/50 hover:text-noir"
                  }`}
                >
                  {c.loginCta || "Login"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode("register");
                    setForgotMsg("");
                    dispatch(clearAuthError());
                  }}
                  className={`flex-1 py-3 text-[11px] uppercase tracking-widest2 transition-colors ${
                    mode === "register" ? "bg-noir text-champagne" : "bg-white/70 text-noir/50 hover:text-noir"
                  }`}
                >
                  {c.registerCta || "Register"}
                </button>
              </div>

              <div className="bg-white/80 border border-champagne/20 p-6 md:p-8 shadow-sm">
                {mode === "forgot" ? (
                  <form onSubmit={submitForgot} className="space-y-4">
                    <p className="text-sm text-noir/55">
                      Enter your account email and we’ll send a reset link.
                    </p>
                    <div>
                      <label className={label}>Email</label>
                      <input
                        name="email"
                        type="email"
                        required
                        className={field}
                        value={form.email}
                        onChange={onChange}
                      />
                    </div>
                    {forgotMsg && <p className="text-sm text-champagne-dark break-all">{forgotMsg}</p>}
                    <button type="submit" className="btn-gold w-full">
                      Send reset link
                    </button>
                    <button
                      type="button"
                      className="w-full text-xs text-champagne-dark underline"
                      onClick={() => setMode("login")}
                    >
                      Back to sign in
                    </button>
                  </form>
                ) : mode === "login" ? (
                  <form onSubmit={submitLogin} className="space-y-4">
                    <div>
                      <label className={label}>Email</label>
                      <input
                        name="email"
                        type="email"
                        required
                        className={field}
                        value={form.email}
                        onChange={onChange}
                      />
                    </div>
                    <div>
                      <label className={label}>Password</label>
                      <input
                        name="password"
                        type="password"
                        required
                        className={field}
                        value={form.password}
                        onChange={onChange}
                      />
                    </div>
                    {error && <p className="text-sm text-rose-600">{error}</p>}
                    <button type="submit" className="btn-gold w-full" disabled={loading}>
                      {loading ? "Signing in…" : c.loginCta || "Sign In"}
                    </button>
                    <button
                      type="button"
                      className="w-full text-xs text-champagne-dark underline"
                      onClick={() => {
                        setMode("forgot");
                        setForgotMsg("");
                      }}
                    >
                      Forgot password?
                    </button>
                    <p className="text-[11px] text-noir/40 text-center">
                      Demo: customer@madhujewellery.com / customer123
                    </p>
                  </form>
                ) : (
                  <form onSubmit={submitRegister} className="space-y-4">
                    <div>
                      <label className={label}>Full name</label>
                      <input name="name" required className={field} value={form.name} onChange={onChange} />
                    </div>
                    <div>
                      <label className={label}>Email</label>
                      <input
                        name="email"
                        type="email"
                        required
                        className={field}
                        value={form.email}
                        onChange={onChange}
                      />
                    </div>
                    <div>
                      <label className={label}>Phone</label>
                      <input name="phone" className={field} value={form.phone} onChange={onChange} />
                    </div>
                    <div>
                      <label className={label}>Address</label>
                      <input
                        name="address"
                        className={field}
                        value={form.address}
                        onChange={onChange}
                        placeholder="Street, building, landmark"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className={label}>City</label>
                        <input name="city" className={field} value={form.city} onChange={onChange} />
                      </div>
                      <div>
                        <label className={label}>State</label>
                        <input name="state" className={field} value={form.state} onChange={onChange} />
                      </div>
                      <div>
                        <label className={label}>PIN code</label>
                        <input name="pinCode" className={field} value={form.pinCode} onChange={onChange} />
                      </div>
                    </div>
                    <div>
                      <label className={label}>Profile photo (optional)</label>
                      <input
                        type="file"
                        accept="image/*"
                        className={field}
                        onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                      />
                    </div>
                    <div>
                      <label className={label}>Password</label>
                      <input
                        name="password"
                        type="password"
                        required
                        minLength={6}
                        className={field}
                        value={form.password}
                        onChange={onChange}
                      />
                    </div>
                    {error && <p className="text-sm text-rose-600">{error}</p>}
                    <button type="submit" className="btn-gold w-full" disabled={loading}>
                      {loading ? "Creating…" : c.registerCta || "Create Account"}
                    </button>
                  </form>
                )}
              </div>
            </>
          )}

          <p className="text-center text-xs text-noir/40 mt-8">
            <Link to="/track-order" className="link-underline text-champagne-dark">
              Track order without signing in
            </Link>
            {" · "}
            Staff?{" "}
            <Link to="/admin/login" className="link-underline text-champagne-dark">
              Admin login
            </Link>
          </p>
        </div>
      </div>
      {customSections.map((s) => (
        <CmsCustomBlock key={s.id} data={s} />
      ))}
    </div>
  );
}
