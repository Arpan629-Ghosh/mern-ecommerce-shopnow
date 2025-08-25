import CommonForm from "@/components/common/Form";
import { registerFormControls } from "@/config";
import { registerUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import logo from "../../assets/logo.png";

const initialState = {
  userName: "",
  email: "",
  password: "",
};

function AuthRegister() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function onSubmit(event) {
    event.preventDefault();
    dispatch(registerUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast(data?.payload?.message, {
          variant: "success",
        });
        navigate("/auth/login");
      } else {
        toast(data?.payload?.message, {
          variant: "destructive",
        });
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
          Create your account
        </h1>
        <p className="text-gray-600 text-sm">
          Already have an account?
          <Link
            className="font-medium ml-1 text-primary hover:underline"
            to="/auth/login"
          >
            Login
          </Link>
        </p>
      </div>

      {/* Form Section */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
        <CommonForm
          formControls={registerFormControls}
          buttonText={"Sign Up"}
          formData={formData}
          setFormData={setFormData}
          onSubmit={onSubmit}
        />
      </div>

      {/* Extra Note */}
      <p className="text-center text-sm text-gray-500">
        By signing up, you agree to our{" "}
        <span className="text-primary hover:underline cursor-pointer">
          Terms of Service
        </span>{" "}
        and{" "}
        <span className="text-primary hover:underline cursor-pointer">
          Privacy Policy
        </span>
        .
      </p>
    </div>
  );
}

export default AuthRegister;
