import { useEffect } from "react";
import {
    useNavigate,
    useRouteError,
} from "react-router-dom";

import Loader from "../loader";

export default function ErrorBoundary() {
    const error = useRouteError() as Error;

    const navigate = useNavigate();

    const message =
        error?.message || "Something went wrong";

    const skip =
        message.includes(
            "dynamically imported module"
        ) || message.includes("preload");

    useEffect(() => {
        if (skip) {
            window.location.reload();
        }
    }, [skip]);

    if (skip) {
        return <Loader loading />;
    }

    return (
        <div
            style={{
                padding: "40px",
                textAlign: "center",
            }}
        >
            <h2 style={{ color: "red" }}>
                {window.location.hostname.includes(
                    "localhost"
                )
                    ? message
                    : "Something went wrong. Please try again."}
            </h2>

            {window.location.hostname.includes(
                "localhost"
            ) && (
                    <pre
                        style={{
                            textAlign: "left",
                            marginTop: "20px",
                        }}
                    >
                        {error?.stack}
                    </pre>
                )}

            <button
                onClick={() => navigate(0)}
                style={{
                    marginTop: "20px",
                    padding: "10px 20px",
                    background: "black",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                }}
            >
                Refresh
            </button>
        </div>
    );
}