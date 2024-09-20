import React, { useEffect, useState } from "react";
import { API_URL } from "./Api";
import axios from "axios";
import { IoMdDoneAll } from "react-icons/io";

import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Box,
  Dialog,
  Typography,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  Alert,
} from "@mui/material";

const defaultFormData = {
  name: "",
  email: "",
  age: "",
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);

  useEffect(() => {
    getUsersDetails();
  }, []);

  const getUsersDetails = async () => {
    try {
      const res = await axios.get(`${API_URL}/users/getUsers`);
      if (res.status === 200) {
        setUsers(res.data);
      } else {
        console.log(res.status);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const hasEmptyFields = Object.values(formData).some(
      (value) => value === "" || value === defaultFormData[value]
    );

    if (hasEmptyFields) {
      alert("All fields are required");
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/users/createUser`, { formData });
      if (res.status === 200) {
        alert("User created successfully");
        getUsersDetails();
        setOpen(false);
      }
    } catch (e) {
      alert("Something went wrong");
      console.error(e);
    }
  };

  const userKeys = Object.keys(users.length > 0 ? users[0] : {}).filter(
    (key) => key !== "_id" && key !== "__v"
  );

  return (
    <>
      {users.length === 0 ? (
        <Box>
          <Typography>User Not Found</Typography>
        </Box>
      ) : (
        <>
          <Typography
            align="center"
            marginY={2}
            fontSize={20}
            fontWeight={600}
            color="secondary"
          >
            Users
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  {userKeys.map((key) => (
                    <TableCell align="center" key={key}>
                      {key === "_id" && key === "__v" ? "" : key}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id}>
                    {Object.keys(user)
                      .filter((key) => key !== "_id" && key !== "__v")
                      .map((key) => (
                        <TableCell align="center" key={key}>
                          {user[key]}
                        </TableCell>
                      ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
      <Box
        display={"flex"}
        alignContent={"center"}
        justifyContent={"center"}
        marginTop={5}
      >
        <Button variant="contained" onClick={() => setOpen(true)}>
          Create User
        </Button>
      </Box>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <Box component="form" onSubmit={handleSubmit} padding={5}>
          <Typography fontSize={20} align="center">
            Enter user information
          </Typography>
          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="name">Name</InputLabel>
            <OutlinedInput
              id="name"
              name="name"
              label="Name"
              required
              value={formData.name}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="email">Email</InputLabel>
            <OutlinedInput
              id="email"
              name="email"
              type="email"
              label="Email"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="age">Age</InputLabel>
            <OutlinedInput
              id="age"
              name="age"
              type="number"
              label="Age"
              value={formData.age}
              required
              onChange={handleChange}
            />
          </FormControl>
          <Box display={"flex"} justifyContent={"center"} marginTop={3}>
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </Box>
        </Box>
      </Dialog>
    </>
  );
};

export default Users;
