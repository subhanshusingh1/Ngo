// import modules
import asynchandler from "express-async-handler";

// import files
import Blog from "../models/Blog.js";

// @Desc Create Blog
// @route Post /api/v1/blogs
// @Access Admin
const createBlog = asynchandler(async (req, res) => {
  const { title, description } = req.body;

  // Validate input
  if (!title || !description) {
    return res.status(400).json({
      success: false,
      message: "All fields are required.",
    });
  }

  // Check if event already exists
  const blogInfo = await Blog.findOne({ title });
  if (blogInfo) {
    return res.status(400).json({ message: "Event Already Exists" });
  }

  //   // Image upload validation
  //   if (!req.file.path) {
  //       return res.status(400).json({ message: "Image is required for the event." });
  //   }

  //   // Extract uploaded img URL from Cloudinary
  //   const imageurl = req.file.path;

  // Create the event
  const blog = await Blog.create({
    title,
    description,
    createdBy : req.user._id
    //   image: imageurl,
  });

  if (blog) {
    res.status(201).json({
      success: true,
      data: blog,
      message: "Blog Created Successfully"
        });
  } else {
    res.status(500).json({
      success: false,
      message: `Blog couldn't be created.`,
    });
  }
});

// @Desc Upload Profile Image for Blog
// @Route POST /api/v1/events/upload-blog-image
// @Access Admin
const uploadBlogGallery = async (req, res) => {
    try {
      // Check if files were uploaded
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No files uploaded." });
      }
  
      console.log(req.user);
  
      const blogId = req.params.id; // Assuming event ID is passed as a URL parameter
  
      // Update the event's gallery with the new image URLs
      const updatedBlog = await Blog.findByIdAndUpdate(
        blogId,
        { $push: { profileImage: { $each: req.files.map(file => file.path) } } }, // Store multiple images
        { new: true }
      );
  
      // Check if event exists
      if (!updatedBlog) {
        return res.status(404).json({ message: "Blog not found." });
      }
  
      return res.status(200).json({
        message: "Event images uploaded successfully.",
        profileImage: updatedBlog.profileImage,
      });
    } catch (error) {
      console.error("Error uploading images:", error);
      return res.status(500).json({
        message: "Error uploading event images.",
        error: error.message,
      });
    }
  };
  

// @Desc Get All Blogs
// @route /api/v1/blogs/
// @Access Admin
const getAllBlogs = asynchandler(async (req, res) => {
  const blogs = await Blog.find({});
  res.status(200).json({
    success: true,
    data: blogs,
    message: blogs.length ? "Blogs Fetched Successfully" : "No Blog Found",
  });
});

// @Desc Get Particular Blog
// @route /api/v1/blogs/:id
// @Access Admin
const getBlogById = asynchandler(async (req, res) => {
  const { id } = req.params;

  try {
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: `No Blog Found with ID: ${id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid Blog ID" });
    }
    throw error;
  }
});

// @Desc Edit or Update Blog
// @route /api/v1/blogs/:id
// @Access Admin
const updateBlog = asynchandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, date, location } = req.body;

  // Find and update event
  const blog = await Blog.findByIdAndUpdate(
    id,
    { title, description },
    { new: true, runValidators: true }
  );

  if (!blog) {
    return res.status(404).json({
      success: false,
      message: `No Blog Found with ID: ${id}`,
    });
  }

  res.status(200).json({
    success: true,
    data: blog,
    message: "Blog Updated Successfully",
  });
});

// @Desc Delete particular Blog
// @route /api/v1/blogs/:id
// @Access Admin
const deleteBlog = asynchandler(async (req, res) => {
  const { id } = req.params;

  try {
    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: `No Blog Found with ID: ${id}`,
      });
    }

    res.status(200).json({
      success: true,
      message: "Blog Deleted Successfully",
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid Blog ID" });
    }
    throw error;
  }
});


export {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  uploadBlogGallery,
};
