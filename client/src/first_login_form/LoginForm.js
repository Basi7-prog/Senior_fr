import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import Axios from "axios";
import Cookies from "js-cookie";
import { checkNavigator } from "./checkNavigator.js";

function LoginForm(user) {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    console.log(data);
    await Axios.post("/login", { data })
      .then((res) => {
        console.log(res.data);
        Cookies.set("accessToken", res.data.accessToken, { expires: 1.0004 });
        user.isLogedIn(res.data);
        navigate(
          `/${checkNavigator(res.data.department.name)}/${
            res.data.user.userName
          }`
        );
      })
      .catch((err) => console.log(err));
  };
  const dropDownStyle =
    "border-[1px] border-borderc rounded-lg px-3 py-1 focus:drop-shadow-[0_0px_3px_#0582F5] focus:border-tenPer outline-0";

  return (
    <div className="flex flex-col w-fit gap-y-16 text-center mx-auto bg-sixtyPer shadow-2xl p-16">
      <h1 className="text-5xl font-bold">Login</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-96 gap-y-16"
      >
        <div className="flex flex-col gap-y-4">
          <label className="">
            User Name
          </label>
            <input
              type="text"
              name="userName"
              value={null}
              className={dropDownStyle}
              {...register("userName")}
            />
        </div>
        <div className="flex flex-col gap-y-4">
          <label>
            password
          </label>
            <input
              type="password"
              name="password"
              className={dropDownStyle}
              value={null}
              {...register("password")}
            />
        </div>
        <button
          type="submit"
          className="rounded-md px-5 py-2 text-sixtyPer text-xl bg-tenPer"
        >
          Login
        </button>
      </form>
      </div>
  );
}

export default LoginForm;
