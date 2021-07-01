import {notify} from "../../../utils/toast";

export default function SubscribeButton() {
    return (
        <button
            className={"p-2.5 flex justify-center items-center bg-green-500 text-white rounded font-light text-sm accessible-button"}
            onClick={() => notify("Ability to subscribe coming soon!", "subscribe")}
        >
            Subscribe
        </button>
    )
}