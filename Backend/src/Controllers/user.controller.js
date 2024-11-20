import bcrypt from "bcrypt";
import ConnectDatabase from "../Database/DBConnection.js";
import jwt from "jsonwebtoken";

const SignUp = async (req, res) => {
  try {
    const { firstname, lastname, username, email, password } = req.body;
    const connection = await ConnectDatabase();
    const [row] = await connection.query(`select * from users where email=?`, [
      email,
    ]);
    if (row.length > 0) {
      return res.status(409).json({ message: "User already existed" });
    }
    const hashpassword = await bcrypt.hash(password, 10);
    const [user] = await connection.query(
      `INSERT INTO users (firstname,lastname,username,email,password) VALUES (?,?,?,?,?)`,
      [firstname, lastname, username, email, hashpassword]
    );
    const [newUser] = await connection.query(
      `SELECT id, firstname, lastname, username, email FROM users WHERE id = ?`,
      [user.insertId]
    );
    return res
      .status(201)
      .json({ message: "User account created successfully", data: newUser[0] });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.message);
  }
};
const LogIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const connection = await ConnectDatabase();
    const [row] = await connection.query(`SELECT * FROM users WHERE email=?`, [
      email,
    ]);
    if (row.length === 0) {
      return res.status(409).json({ message: "User does not exist" });
    }
    const isMatch = await bcrypt.compare(password, row[0].password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const { password: _, ...userWithoutPassword } = row[0];
    const token = await jwt.sign({ id: row[0].id }, process.env.ACCESS_TOKEN, {
      expiresIn: "3h",
    });
    return res
      .status(200)
      .cookie("accessToken", token, {
        httpOnly: true,
        secure: true,
      })
      .json({
        message: "User logged In successfully",
        data: userWithoutPassword,
        accessToken: token,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.message);
  }
};
const GetAllUsers = async (req, res) => {
  try {
    const connection = await ConnectDatabase();
    const [users] = await connection.query(
      `SELECT id,firstname, lastname, username, email FROM users`
    );
    if (users.length === 0) {
      return res.status(404).json({ message: "No records found" });
    }
    return res
      .status(201)
      .json({ message: "User account created successfully", data: users });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
const GetUserInfo = async (req, res) => {
  try {
    const connection = await ConnectDatabase();
    const [user] = await connection.query(
      `SELECT * FROM users WHERE id=?`,
      [req.userId]
    );
    if (user.length === 0) {
      return res.status(404).json({ message: "No records found" });
    }
    const {password:_,...userinfo}=user[0]
    return res
      .status(201)
      .json({ message: "User details fetched successfully", data:userinfo });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

export { SignUp, GetAllUsers, LogIn,GetUserInfo };
