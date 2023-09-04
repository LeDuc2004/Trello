import React, { useState } from "react";
import validator from "validator";
import "./index.scss"
import { getData } from "../../services";
import env from "../../env";
const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    account: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    account: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    console.log(name);
    setFormData({
      ...formData,
      [name]: value,
    });
    if (name === "name") {
      if (value == "") {
        setErrors({
          ...errors,
          name: "Tên không được để trống",
        });
        return
      }
      setErrors({
        ...errors,
        name: "",
      });
    }
    if (name === "account") {
        if (value == "") {
          setErrors({
            ...errors,
            account: "Tài khoản không được để trống",
          });
          return
        }
        setErrors({
          ...errors,
          account: "",
        });
      }
      if (name === "password") {
        if (value == "") {
          setErrors({
            ...errors,
            password: "Mật khẩu không được để trống",
          });
          return
        }
        setErrors({
          ...errors,
          password: "",
        });
      }
      if (name === "confirmPassword") {
        if (value == "") {
          setErrors({
            ...errors,
            confirmPassword: "Xác nhận không được để trống",
          });
          return
        }
        setErrors({
          ...errors,
          confirmPassword: "",
        });
      }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Reset errors
    setErrors({
      name: "",
      account: "",
      password: "",
      confirmPassword: "",
    });

    // Validation
    let hasErrors = false;
    if (!formData.name.trim()) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        name: "Tên không được để trống",
      }));
      hasErrors = true;
    }

    if (!formData.account.trim()) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        account: "Tài khoản không được để trống",
      }));
      hasErrors = true;
    } else if (!validator.isEmail(formData.account)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        account: "Tài khoản phải là email hợp lệ",
      }));
      hasErrors = true;
    }

    if (
      formData.password.length < 6 ||
      !/[A-Z]/.test(formData.password) ||
      !/\d/.test(formData.password) ||
      /[!@#$%^&*(),.?":{}|<>]/.test(formData.password)
    ) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "Mật khẩu phải có ít nhất 6 ký tự, chữ cái viết hoa và số",
      }));
      hasErrors = true;
    }
    if (!formData.confirmPassword.trim()) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmPassword: "Xác nhân mật khẩu không được để trống",
      }));
      hasErrors = true;
    } else if (formData.password !== formData.confirmPassword) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmPassword: "Xác nhận mật khẩu không khớp",
      }));
      hasErrors = true;
    }

    if (!hasErrors) {
      getData(`/users`)
      .then((dataUsers)=>{
        console.log(dataUsers);
      })
     
    }
  };
  const onblurName = () => {
    setErrors({
        ...errors,
      name: "",
    });
    if (!formData.name.trim()) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        name: "Tên không được để trống",
      }));
    }
  };
  const onblurEmail = () => {
    setErrors({
        ...errors,
      account: "",
    });
    if (!formData.account.trim()) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        account: "Tài khoản khẩu không được để trống",
      }));
    }
  };
  const onblurPassword = () => {
    setErrors({
        ...errors,
      password: "",
    });
    if (!formData.password.trim()) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "Mật khẩu không được để trống",
      }));
    }
  };
  const onblurComfirmPassword = () => {
    setErrors({
        ...errors,
      confirmPassword: "",
    });
    if (!formData.confirmPassword.trim()) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmPassword: "Xác nhận không được để trống",
      }));
    }
  };

  return (
    <form className="form-authen" onSubmit={handleSubmit}>
        <h1>Sign in</h1>
      <div className="authen-name">
        <input
        placeholder="Name..."
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          onBlur={onblurName}
        />
        {errors.name && <p>{errors.name}</p>}
      </div>
      <div className="authen-account">
        <input
        placeholder="Email..."
          type="text"
          id="account"
          name="account"
          value={formData.account}
          onChange={handleChange}
          onBlur={onblurEmail}
        />
        {errors.account && <p>{errors.account}</p>}
      </div>
      <div className="authen-password">
        <input
        placeholder="Password..."
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          onBlur={onblurPassword}
        />
        {errors.password && <p>{errors.password}</p>}
      </div>
      <div className="authen-confirmPassword">
        <input
        placeholder="Confirm password..."
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          onBlur={onblurComfirmPassword}
        />
        {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
      </div>
      <button type="submit">Đăng ký</button>
    </form>
  );
};

export default RegisterForm;
