/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy } from "react";
import { ROUTE } from "./const"

const Signup = lazy(() => import("../page/auth/register/register"))
const Login = lazy(() => import("../page/auth/login/login"))
const Terms = lazy(() => import("../page/terms"))
const Privacy = lazy(() => import("../page/privacy"))
const Landing = lazy(() => import("../page/components/landing/landing"))
const ForgetPassword = lazy(() => import("../page/auth/forgetpassword/forget-password"))
const ResetPassword = lazy(() => import("../page/auth/resetpassword/reset-password"))
const Dashboard = lazy(() => import("../page/dashboard/overview/overview"))
import MainLayout from "../components/layout/mainlayout/MainLayout";
const PlaygroundPage = lazy(() => import("../page/components/playground/playground-page"));
const PricingPage = lazy(() => import("../page/components/pricing/pricing"));
const ContactUs = lazy(() => import("../page/components/contactus/contact-us"));

export const router = createBrowserRouter([
  {
    path: ROUTE.LOGIN,
    element: <Login />,
  },
  {
    path: ROUTE.SIGNUP,
    element: <Signup />,
  },
  {
    path: ROUTE.TERMS,
    element: <Terms />,
  },
  {
    path: ROUTE.PRIVACY,
    element: <Privacy />,
  },
  {
    path: ROUTE.LANDING,
    element: <Landing />,
  },
  {
    path: ROUTE.PLAYGROUND,
    element: <PlaygroundPage />,
  },
  {
    path: ROUTE.PRICING,
    element: <PricingPage />,
  },
  {
    path: ROUTE.CONTACT,
    element: <ContactUs />,
  },
  {
    path: ROUTE.FORGOT_PASSWORD,
    element: <ForgetPassword />,
  },
  {
    path: ROUTE.RESET_PASSWORD,
    element: <ResetPassword />,
  },
  {
    element: <MainLayout />,
    children: [
      {
        path: ROUTE.DASHBOARD,
        element: <Dashboard />,
        children: [
          {
            path: "activity",
            element: <Dashboard />,
          },
          {
            path: "usage",
            element: <Dashboard />,
          },
          {
            path: "apikeys",
            element: <Dashboard />,
          },
          {
            path: "settings",
            element: <Dashboard />,
          },
          {
            path: "search",
            element: <Dashboard />,
          },
          {
            path: "scrape",
            element: <Dashboard />,
          },
          {
            path: "parse",
            element: <Dashboard />,
          },
          {
            path: "map",
            element: <Dashboard />,
          },
          {
            path: "crawl",
            element: <Dashboard />,
          },
        ],
      },
    ],
  },
  { path: "*", element: <Navigate replace to={ROUTE.LANDING} /> }
]);