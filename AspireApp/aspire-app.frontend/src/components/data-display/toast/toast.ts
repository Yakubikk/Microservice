import toast from "react-hot-toast";

export const showToast = (message: string) => {
    toast.error(message, {
        style: {
            minWidth: "max-content",
        },
    });
};

export default showToast;
