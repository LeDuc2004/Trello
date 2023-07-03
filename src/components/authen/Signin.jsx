import Header from "../common/header/Header";
import React, { useState, useEffect } from "react";
import "./signin.scss";
import jwt_decode from "jwt-decode";

import { LoginSocialFacebook } from "reactjs-social-login";
import { FacebookLoginButton } from "react-social-login-buttons";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

function Signin() {
  const [spanName, setSpanName] = useState(".");
  const [spantk, setSpantk] = useState(".");
  const [spanmk, setSpanmk] = useState(".");
  const [spancf, setSpancf] = useState(".");
  const [name, setName] = useState("");
  const [tk, setTk] = useState("");
  const [mk, setMk] = useState("");
  const [cfmk, setCfmk] = useState("");
  const [togle, setTogle] = useState(true);
  const [common, setCommon] = useState(true);
  const API_DATA_BASE = process.env.REACT_APP_API_BASE;
  function getRandomColor() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  useEffect(() => {
    setCommon(localStorage.getItem("idd"));
  }, [localStorage.getItem("idd")]);
  const responseGoogle = (responseStart) => {
    if (responseStart.provider == "facebook") {
      const user = {
        tk: responseStart.data.email,
        name: responseStart.data.name,
        id: responseStart.data.userID,
      };
      handleSubmitdk(user);
    } else {
      let response = jwt_decode(responseStart.credential);
      const user = {
        email: response.email,
        name: response.name,
        image: response.picture,
        accessToken: response.jti,
        id: response.sub,
      };
      handleSubmitdk(user);
    }
  };

  let useAuthen = {
    id: Math.random(),
    tk:name,
    email: tk,
    color:getRandomColor(),
    mk: mk,
    token: [],
    idTable: [],
  };
  function handleSubmitdk(fborgg) {
    if (fborgg) {
      if (fborgg.image) {
        let user = {
          id: fborgg.id,
          tk: fborgg.name,
          img: fborgg.image,
          token: [],
          idTable: [],
        };
        fetch(API_DATA_BASE + "/users")
          .then((res) => res.json())
          .then((data) => {
            authengg(data);
          });
        function authengg(data) {
          let flag = true;
          for (let i = 0; i < data.length; i++) {
            if (fborgg.name != data[i].tk) {
              flag = false;
              continue;
            } else {
              flag = true;
              break;
            }
          }
          if (flag == false) {
            fetch(API_DATA_BASE + "/users", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(user),
            });
            handleSubmitdn(user);
          } else if (flag == true) {
            fetch(API_DATA_BASE + `/users/${fborgg.id}`)
              .then((res) => res.json())
              .then((data) => {
                handleSubmitdn(data);
              });
          }
        }
      }else{
        let user = {
          id: fborgg.id,
          tk: fborgg.name,
          color:getRandomColor(),
          token: [],
          idTable: [],
        };
        fetch(API_DATA_BASE + "/users")
          .then((res) => res.json())
          .then((data) => {
            authengg(data);
          });
        function authengg(data) {
          let flag = true;
          for (let i = 0; i < data.length; i++) {
            if (fborgg.name != data[i].tk) {
              flag = false;
              continue;
            } else {
              flag = true;
              break;
            }
          }
          if (flag == false) {
            fetch(API_DATA_BASE + "/users", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(user),
            });
            handleSubmitdn(user);
          } else if (flag == true) {
            fetch(API_DATA_BASE + `/users/${fborgg.id}`)
              .then((res) => res.json())
              .then((data) => {
                handleSubmitdn(data);
              });
          }
        }
      }
    } else {
      if (tk == "" && mk == "" && cfmk == "" && name == "") {
        setSpantk("Vui lòng nhập tài khoản.");
        setSpanmk("Vui lòng nhập mật khẩu.");
        setSpancf("Vui lòng xác nhận mật khẩu.");
        setSpanName("Vui lòng nhập tên của bạn");
      } else {
        if (name == "") {
          setSpanName("Vui lòng nhập tài khoản.");
        } else {
          setSpanName(".");
        }
        if (tk == "") {
          setSpantk("Vui lòng nhập tài khoản.");
        } else {
          setSpantk(".");
        }
        if (mk == "" && cfmk == "") {
          setSpanmk("Vui lòng nhập mật khẩu.");
          setSpancf("Vui lòng nhập xác nhận mật khẩu.");
        } else {
          if (mk == "") {
            setSpanmk("Vui lòng nhập mật khẩu.");
          } else {
            setSpanmk(".");
            if (mk != "" && mk != cfmk) {
              setSpancf("Mật khẩu nhập lại không khớp.");
            } else if (cfmk != "") {
            } else {
              setSpancf(".");
            }
          }
        }
      }

      fetch(API_DATA_BASE + "/users")
        .then((res) => res.json())
        .then((data) => {
          authen(data);
        });
      function authen(data) {
        let flag = "";
        for (let i = 0; i < data.length; i++) {
          if (tk != data[i].tk) {
            flag = false;
            continue;
          } else {
            flag = true;
            break;
          }
        }
        if (flag == false) {
          if (mk != "" && cfmk != "" && mk == cfmk) {
            fetch(API_DATA_BASE + "/users", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(useAuthen),
            }).then(res => idd(2))
          }
        } else if (flag == true) {
          setSpantk("Tài khoản tồn tại");
        }
      }
    }
  }
  function handleSubmitdn(fborgg) {
    if (fborgg) {
      fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: "levanduc",
        },
        body: JSON.stringify({
          id: fborgg.id,
          name: fborgg.tk,
          img: fborgg.img,
        }),
      })
        .then((res) => res.json())
        .then((data1) => {
          fetch(API_DATA_BASE + `/users/${fborgg.id}`)
            .then((res) => res.json())
            .then((data) => {
              pushtoken(data);
            });
          function pushtoken(data2) {
            data2.token.push(data1.accessToken);
            fetch(API_DATA_BASE + `/users/${fborgg.id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                authorization: "levanduc",
              },
              body: JSON.stringify(data2),
            }).then((res) => {
              if (res.status == 200) {
                localStorage.setItem("token", data1.accessToken);

                window.location.href = "/";
              }
            });
          }
        });
    } else {
      if (tk == "" && mk == "") {
        setSpantk("Vui lòng nhập tài khoản.");
        setSpanmk("Vui lòng nhập mật khẩu.");
      } else {
        fetch(API_DATA_BASE + "/users")
          .then((res) => res.json())
          .then((data) => {
            authen(data);
          });
        function authen(data) {
          let flag = true;
          for (let i = 0; i < data.length; i++) {
            if (tk != data[i].email) {
              flag = false;
              continue;
            } else {
              if (mk == "") {
                setSpanmk("Vui lòng nhập mật khẩu.");
                setSpantk(".");
              } else {
                setSpanmk(".");
                if (mk == data[i].mk) {
                  fetch("http://localhost:5000/login", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      authorization: "levanduc",
                    },
                    body: JSON.stringify({ id: data[i].id, name: data[i].tk }),
                  })
                    .then((res) => res.json())
                    .then((data1) => {
                      fetch(API_DATA_BASE + `/users/${data[i].id}`)
                        .then((res) => res.json())
                        .then((data) => {
                          pushtoken(data);
                        });
                      function pushtoken(data2) {
                        data2.token.push(data1.accessToken);
                        fetch(API_DATA_BASE + `/users/${data[i].id}`, {
                          method: "PUT",
                          headers: {
                            "Content-Type": "application/json",
                            authorization: "levanduc",
                          },
                          body: JSON.stringify(data2),
                        }).then((res) => {
                          if (res.status == 200) {
                            localStorage.setItem("token", data1.accessToken);
                            setSpantk(".");
                            window.location.href = "/";
                          }
                        });
                      }
                    });

                  break;
                } else {
                  flag = true;
                  setSpantk(".");
                  setSpanmk("Mật khẩu không chính xác.");
                }
              }

              flag = true;
              break;
            }
          }
          if (flag == false) {
            setSpantk("Tài khoản không chính xác");
            setSpanmk(".");
          }
        }
      }
    }
  }

  function idd(id) {
    setName("")
    setMk("");
    setTk("");
    setCfmk("");
    setSpantk(".");
    setSpanmk(".");
    setSpancf(".");
    setTogle(!togle);
    localStorage.setItem("idd", id);
  }
  return (
    <div
      style={{
        backgroundColor: "#f9fafc",
        position: "relative",
        height: "100vh",
      }}
    >
      <a href="http://localhost:3001/home" className="logo-sign">
        <div>
          <img
            src="https://d2k1ftgv7pobq7.cloudfront.net/meta/c/p/res/images/trello-header-logos/167dc7b9900a5b241b15ba21f8037cf8/trello-logo-blue.svg"
            alt=""
          />
        </div>
      </a>
      <div className="tbl-dn">
        <div className="common-cha">
          <div
            onClick={() => idd(1)}
            className={common == 2 ? "common" : "common in"}
          >
            Đăng ký
          </div>
          <div
            onClick={() => idd(2)}
            className={common == 1 ? "common" : "common in"}
          >
            Đăng nhập
          </div>
          <div className={common == 2 ? "cuon" : "cuon1"}></div>
        </div>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="Tên của bạn.."
          style={common == 2 ? { display: "none" } : { display: "" }}
        />
        <p
          style={
            spanName == "."
              ? { visibility: "hidden" }
              : { visibility: "visible" }
          }
        >
          {spanName}
        </p>

        <input
          value={tk}
          onChange={(e) => setTk(e.target.value)}
          type="text"
          placeholder="Tài khoản..."
        />
        <p
          style={
            spantk == "." ? { visibility: "hidden" } : { visibility: "visible" }
          }
        >
          {spantk}
        </p>
        <input
          value={mk}
          onChange={(e) => setMk(e.target.value)}
          type="password"
          placeholder="Mật khẩu..."
        />
        <p
          style={
            spanmk == "." ? { visibility: "hidden" } : { visibility: "visible" }
          }
        >
          {spanmk}
        </p>
        <input
          value={cfmk}
          onChange={(e) => setCfmk(e.target.value)}
          type="password"
          placeholder="Xác nhận mật khẩu..."
          style={common == 2 ? { display: "none" } : { display: "" }}
        />
        <p
          style={
            spancf == "." ? { visibility: "hidden" } : { visibility: "visible" }
          }
        >
          {spancf}
        </p>
        <div
          style={common == 2 ? { display: "none" } : { display: "" }}
          className="btn-dk"
          onClick={() => handleSubmitdk()}
        >
          Đăng ký
        </div>
        <div
          style={common == 1 ? { display: "none" } : { display: "" }}
          className="btn-dk"
          onClick={() => handleSubmitdn()}
        >
          Đăng nhập
        </div>
        <div
          style={common == 1 ? { display: "none" } : { display: "" }}
          className="text-or"
        >
          hoặc
        </div>

        <div
          style={common == 1 ? { display: "none" } : { display: "" }}
          className="google"
        >
          <GoogleOAuthProvider clientId="766236273680-8dso0bb9aub5jvh0u6afjh5cif7g1fif.apps.googleusercontent.com">
            <GoogleLogin
              onSuccess={(res) => {
                responseGoogle(res);
              }}
              onError={(err) => {
                console.log(err);
              }}
            />
          </GoogleOAuthProvider>
        </div>
        <div
          style={common == 1 ? { display: "none" } : { display: "" }}
          className="facebook-1"
        >
          <LoginSocialFacebook
            appId="5916611618449616"
            onResolve={(res) => {
              responseGoogle(res);
            }}
            onReject={(err) => {
              console.log(err);
            }}
          >
            <FacebookLoginButton></FacebookLoginButton>
          </LoginSocialFacebook>
        </div>
      </div>
      <div className="background-bottom">
        <div className="left">
          <img src="./left.png" alt="" />
        </div>
        <div className="right">
          <img src="./right.png" alt="" />
        </div>
      </div>
    </div>
  );
}

export default Signin;
