import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import Axios from "axios";
import Cookies from "js-cookie";
import { checkNavigator } from "./checkNavigator.js";

function LoginForm() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    console.log(data);
    await Axios.post("/login", { data })
      .then((res) => {
        console.log(res.data);
        Cookies.set("accessToken", res.data.accessToken, { expires: 1.0004 });
        navigate(`/${checkNavigator(res.data.departments.name)}/${res.data.user.userName}`);
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className="">
      <header className="">
        <form onSubmit={handleSubmit(onSubmit)}>
          <label className="">
            User Name:
            <input
              type="text"
              name="userName"
              value={null}
              {...register("userName")}
            />
          </label>
          <label>
            password:
            <input
              type="password"
              name="password"
              value={null}
              {...register("password")}
            />
          </label>

          <button type="submit">Login</button>
        </form>
      </header>
    </div>
  );
}

export default LoginForm;
