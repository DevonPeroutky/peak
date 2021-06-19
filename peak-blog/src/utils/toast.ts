import { toast } from 'react-toastify';

export const notify = (message, id = "random") => toast(message, {
    toastId: id
});
