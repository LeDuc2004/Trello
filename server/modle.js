import express from "express";
import jwt from "jsonwebtoken";
import cors from "cors";
const app = express();
app.use(express.json());
app.use(cors());

app.post("/addTable", authenToken , (req ,res)=>{
  const id = req.user.id;
  const TableToUser = req.body
  fetch(`http://localhost:3000/users/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      let arrayIdTable = data.idTable.slice()
      arrayIdTable.push(TableToUser)  
      console.log(arrayIdTable);
      let newData = {
        ...data,
        idTable:arrayIdTable 
      }
      fetch(`http://localhost:3000/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newData)
      })
      res.status(200).send("ok");
    })
})
app.get("/authenAdmin", authenToken, (req, res) => {
  const id = req.user.id;
  if (id == 108043588203461517800) {
    res.status(200).send("ok");
  } else {
    res.send(201).send("qq");
  }
});
app.post("/login", (req, res) => {
  if (req.headers.authorization == "levanduc") {
    const accessToken = jwt.sign(req.body, "levanduc");
    res.status(200).send({ accessToken });
  } else {
    res.status(404).send("ERROR");
  }
});
app.get("/user", authenToken, (req, res) => {
  const user = req.user;
  res.send({ user });
});
app.post("/logout", (req, res) => {
  let user = req.body;
  fetch(`http://localhost:3000/users/${user.iduser}`)
    .then((res) => res.json())
    .then((data) => {
      data.token = data.token.filter((item) => item != user.token);

      fetch(`http://localhost:3000/users/${user.iduser}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: "levanduc",
        },
        body: JSON.stringify(data),
      });
    });
  res.send({ mess: "success" });
});
function authenToken(req, res, next) {
  const authorization = req.headers.authorization;
  const token = authorization.split(" ")[1];
  if (!token) res.send(401);
  jwt.verify(token, "levanduc", (err, data) => {
    if (data) {
      req.user = data;
      next();
    }else{
      res.send(404)
    }
  });
}

app.listen(5000, () => {
  console.log("http://localhost:5000");
});
