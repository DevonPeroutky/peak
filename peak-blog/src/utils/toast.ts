import { toast, ToastOptions } from 'react-toastify';

export const notify = (message, id = "random", options?: ToastOptions) => toast(message, {
    toastId: id,
    ...options
});
