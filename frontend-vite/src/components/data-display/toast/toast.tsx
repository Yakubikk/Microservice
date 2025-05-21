import toast, {type ToastOptions, type Toast } from "react-hot-toast";

type ActionToastOptions = ToastOptions & {
    actionText: string;
    onActionClick: () => void;
};

type ToastType =
    | "default"
    | "success"
    | "error"
    | "info"
    | "loading"
    | "action";

export const showToast = {
    // Base toast
    default: (message: string, options?: ToastOptions) => {
        toast(message, {
            style: {
                minWidth: "max-content",
                background: "#fff",
                color: "#333",
                boxShadow:
                    "0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05)",
            },
            ...options,
        });
    },

    // Info toast
    info: (message: string, options?: ToastOptions) => {
        toast(message, {
            style: {
                minWidth: "max-content",
                background: "#3b82f6",
                color: "#fff",
            },
            icon: "ℹ️",
            ...options,
        });
    },

    // Success toast
    success: (message: string, options?: ToastOptions) => {
        toast.success(message, {
            style: {
                minWidth: "max-content",
            },
            ...options,
        });
    },

    // Error toast
    error: (message: string, options?: ToastOptions) => {
        toast.error(message, {
            style: {
                minWidth: "max-content",
            },
            ...options,
        });
    },

    // Action toast
    action: (
        message: string,
        { actionText, onActionClick, ...options }: ActionToastOptions
    ) => {
        toast(
            (t: Toast) => (
                <div className="flex items-center gap-4">
                    <span>{message}</span>
                    <button
                        onClick={() => {
                            onActionClick();
                            toast.dismiss(t.id);
                        }}
                        className="px-3 py-1 rounded bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                    >
                        {actionText}
                    </button>
                </div>
            ),
            {
                style: {
                    minWidth: "max-content",
                },
                ...options,
            }
        );
    },

    // Loading toast
    loading: (message: string, options?: ToastOptions) => {
        return toast.loading(message, {
            style: {
                minWidth: "max-content",
            },
            ...options,
        });
    },

    // Universal show method with type parameter
    show: (
        message: string,
        type: ToastType = "default",
        options?: ToastOptions | ActionToastOptions
    ) => {
        switch (type) {
            case "success":
                return showToast.success(message, options);
            case "error":
                return showToast.error(message, options);
            case "info":
                return showToast.info(message, options);
            case "loading":
                return showToast.loading(message, options);
            case "action":
                if ("actionText" in options! && "onActionClick" in options!) {
                    return showToast.action(
                        message,
                        options as ActionToastOptions
                    );
                }
                return showToast.default(message, options);
            default:
                return showToast.default(message, options);
        }
    },

    // Update existing toast
    update: (
        id: string,
        message: string,
        type: ToastType = "default",
        options?: ToastOptions | ActionToastOptions
    ) => {
        const baseOptions = {
            id,
            style: {
                minWidth: "max-content",
                ...(type === "info" && {
                    background: "#3b82f6",
                    color: "#fff",
                }),
            },
            icon: type === "info" ? "ℹ️" : undefined,
        };

        switch (type) {
            case "success":
                toast.success(message, { ...baseOptions, ...options });
                break;
            case "error":
                toast.error(message, { ...baseOptions, ...options });
                break;
            case "info":
                toast(message, { ...baseOptions, ...options });
                break;
            case "action":
                if (
                    options &&
                    "actionText" in options &&
                    "onActionClick" in options
                ) {
                    toast(
                        (t: Toast) => (
                            <div className="flex items-center gap-4">
                                <span>{message}</span>
                                <button
                                    onClick={() => {
                                        options.onActionClick();
                                        toast.dismiss(t.id);
                                    }}
                                    className="px-3 py-1 rounded bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                                >
                                    {options.actionText}
                                </button>
                            </div>
                        ),
                        { ...baseOptions, ...options }
                    );
                }
                break;
            default:
                toast(message, { ...baseOptions, ...options });
        }
    },

    // Dismiss toast
    dismiss: (id?: string) => {
        toast.dismiss(id);
    },

    // Remove all toasts
    clear: () => {
        toast.remove();
    },
};

export default showToast;
