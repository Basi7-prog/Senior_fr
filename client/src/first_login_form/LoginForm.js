import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import Axios from "axios";

function LoginForm() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    console.log(data);
    await Axios.post("/find", { data })
      .then((res) => {
        console.log(res.data);
        navigate(`/it/${res.data.user.id}`);
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className="">
      <header className="">
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>
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
