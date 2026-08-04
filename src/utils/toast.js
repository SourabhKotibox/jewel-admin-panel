import toast from "react-hot-toast";

const style = {
  borderRadius: "12px",
  background: "#0f0d0b",
  color: "#f5f0e8",
  fontSize: "13px",
  padding: "12px 16px",
  maxWidth: "420px",
};

export const notify = {
  success: (message) => toast.success(message, { style, duration: 3200 }),
  error: (message) => toast.error(message || "Something went wrong", { style, duration: 4500 }),
  info: (message) => toast(message, { style, duration: 3200, icon: "ℹ️" }),
  loading: (message) => toast.loading(message, { style }),
  dismiss: (id) => toast.dismiss(id),
  promise: (promise, msgs) =>
    toast.promise(promise, msgs, { style, success: { duration: 3200 }, error: { duration: 4500 } }),
};

export default notify;
