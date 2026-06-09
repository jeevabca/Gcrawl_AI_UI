import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { router } from "./routes";
import { Suspense, useEffect } from "react";
import Loader from "./components/loader";
import { GithubStarsProvider } from "./context/GithubStarsContext";

const App = () => {

useEffect(() => {
  const style = document.createElement("style");
  style.innerHTML = `.grecaptcha-badge { visibility: hidden !important; }`;
  document.head.appendChild(style);
  const script = document.createElement("script");
  script.src = `https://www.google.com/recaptcha/api.js?render=${import.meta.env.VITE_RECAPTCHA_SITE_KEY}`;
  script.async = true;
  script.defer = true;
  script.onload = () => {
    console.log("reCAPTCHA loaded");
  };

  document.body.appendChild(script);

  return () => {
    document.body.removeChild(script);
  };
}, []);

  

  return (
    <Suspense fallback={<Loader loading />}>
      <Toaster position="top-right" />
      <GithubStarsProvider>
        <RouterProvider router={router} />
      </GithubStarsProvider>
    </Suspense>
  )
}

export default App
