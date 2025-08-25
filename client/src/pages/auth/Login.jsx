import CommonForm from "@/components/common/Form";
import { loginFormControls } from "@/config";
import { loginUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import logo from "../../assets/logo.png";

const initialState = {
  email: "",
  password: "",
};

function AuthLogin() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();

  function onSubmit(event) {
    event.preventDefault();

    dispatch(loginUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast(data?.payload?.message, { variant: "success" });
      } else {
        toast(data?.payload?.message, { variant: "destructive" });
      }
    });
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-8">
      {/* Logo + Heading */}
      <div className="flex flex-col items-center space-y-3">
        <img
          src={logo}
          alt="logo"
          className="h-20 w-20 rounded-2xl shadow-lg border border-gray-300 bg-white p-2"
        />
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
          Sign in to your account
        </h1>
        <p className="text-gray-600 text-sm">
          Don’t have an account?
          <Link
            className="font-medium ml-1 text-primary hover:underline"
            to="/auth/register"
          >
            Register
          </Link>
        </p>
      </div>

      {/* Form Section */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
        <CommonForm
          formControls={loginFormControls}
          buttonText={"Sign In"}
          formData={formData}
          setFormData={setFormData}
          onSubmit={onSubmit}
        />
      </div>

      {/* Extra Note */}
      <p className="text-center text-sm text-gray-500">
        This site is protected by reCAPTCHA and the Google{" "}
        <span className="text-primary hover:underline cursor-pointer">
          Privacy Policy
        </span>{" "}
        and{" "}
        <span className="text-primary hover:underline cursor-pointer">
          Terms of Service
        </span>{" "}
        apply.
      </p>
    </div>
  );
}

export default AuthLogin;
