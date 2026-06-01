import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { router } from "./routes";
import { Suspense } from "react";
import Loader from "./components/loader";
import { GithubStarsProvider } from "./context/GithubStarsContext";

const App = () => {

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
