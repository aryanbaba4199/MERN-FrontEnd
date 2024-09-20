import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
} from "@mui/material";
import { API_URL } from "./Api";
import Swal from "sweetalert2";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [blogItem, setBlogItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    author: "",
    imageUri: "",
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get(`${API_URL}/blogs/getBlogs`);
      if (res.status === 200) {
        setBlogs(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDialogOpen = (blog = null) => {
    setBlogItem(blog);
    if (blog) {
      
      setFormData({
        title: blog.title,
        description: blog.description,
        author: blog.author,
        imageUri: blog.imageUri,
      });
    } else {
    
      setFormData({
        title: "",
        description: "",
        author: "",
        imageUri: "",
      });
    }
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleDelete = async (blogId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_URL}/blogs/deleteBlog/${blogId}`);
          Swal.fire("Deleted!", "Your blog has been deleted.", "success");
          fetchBlogs(); 
        } catch (error) {
          Swal.fire("Error!", "Failed to delete the blog.", "error");
        }
      }
    });
  };

  const handleFormSubmit = async () => {
    try {
      if (blogItem) {
        
        await axios.put(`${API_URL}/blogs/updateBlog/${blogItem._id}`, {
          formData,
        });
        Swal.fire("Success!", "Blog updated successfully.", "success");
      } else {
   
        await axios.post(`${API_URL}/blogs/createBlog`, { formData });
        Swal.fire("Success!", "Blog created successfully.", "success");
      }
      fetchBlogs(); 
      setOpenDialog(false); 
    } catch (error) {
      Swal.fire("Error!", "Something went wrong!", "error");
    }
  };
  console.log(blogs[0].imageUri);
  return (
    <>
      <Container maxWidth="lg" sx={{ marginTop: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Blog Posts
        </Typography>

        {loading ? (
          <CircularProgress />
        ) : blogs.length > 0 ? (
          <Grid container spacing={4}>
            {blogs.map((blog) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={blog._id}
                onClick={() => {
                  Swal.fire({
                    title: "Choose an option",
                    showDenyButton: true,
                    showCancelButton: true,
                    confirmButtonText: "Create",
                    denyButtonText: "Edit",
                    cancelButtonText: "Delete",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      handleDialogOpen(); 
                    } else if (result.isDenied) {
                      handleDialogOpen(blog); 
                    } else if (result.dismiss === Swal.DismissReason.cancel) {
                      handleDelete(blog._id); 
                    }
                  });
                }}
              >
                <Card>
                  {blog.imageUri && (
                    <CardMedia
                      component="img"
                      height={140}
                      width={140}
                      image={
                        blog?.imageUri
                          ? blog.imageUri
                          : "https://cdn-ilaonaj.nitrocdn.com/YAqTDMRLiaWaFyWgOcGRYUflsLFBzQYz/assets/images/optimized/rev-7402e99/miro.medium.com/v2/resize:fit:963/1*5mtiu2DLamB1ZG6Q5rOGYw.png"
                      }
                      alt={blog.title}
                    />
                  )}
                  <CardContent>
                    <Typography variant="h5" component="div">
                      {blog.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {blog.description}
                    </Typography>
                    <Typography variant="subtitle1" color="text.primary">
                      By: {blog.author}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="h6" color="textSecondary">
            No blogs found.
          </Typography>
        )}
      </Container>


      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>{blogItem ? "Edit Blog" : "Create Blog"}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Title"
            fullWidth
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Author"
            fullWidth
            value={formData.author}
            onChange={(e) =>
              setFormData({ ...formData, author: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Image URL"
            fullWidth
            value={formData.imageUri}
            onChange={(e) =>
              setFormData({ ...formData, imageUri: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleFormSubmit} color="primary">
            {blogItem ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default App;
