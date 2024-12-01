// import modules
import asynchandler from "express-async-handler";

// import files
import Events from "../models/Events.js";
import Volunteer from "../models/Volunteer.js";

// @Desc Create Event
// @route Post /api/v1/events
// @Access Admin
const createEvent = asynchandler(async (req, res) => {
  const { title, description, date, location } = req.body;

  // Validate input
  if (!title || !description || !date || !location) {
    return res.status(400).json({
      success: false,
      message: "All fields are required.",
    });
  }

  // Check if event already exists
  const eventInfo = await Events.findOne({ title });
  if (eventInfo) {
    return res.status(400).json({ message: "Event Already Exists" });
  }

  //   // Image upload validation
  //   if (!req.file.path) {
  //       return res.status(400).json({ message: "Image is required for the event." });
  //   }

  //   // Extract uploaded img URL from Cloudinary
  //   const imageurl = req.file.path;

  // Create the event
  const event = await Events.create({
    title,
    description,
    date,
    location,
    createdBy : req.user._id
    //   image: imageurl,
  });

  if (event) {
    res.status(201).json({
      success: true,
      data: event
        });
  } else {
    res.status(500).json({
      success: false,
      message: `Event couldn't be created.`,
    });
  }
});

// @Desc Upload Profile Image
// @Route POST /api/v1/events/upload-event-image
// @Access Admin
const uploadEventGallery = async (req, res) => {
    try {
      // Check if files were uploaded
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No files uploaded." });
      }
  
      console.log(req.user);
  
      const eventId = req.params.id; // Assuming event ID is passed as a URL parameter
  
      // Update the event's gallery with the new image URLs
      const updatedEvent = await Events.findByIdAndUpdate(
        eventId,
        { $push: { profileImage: { $each: req.files.map(file => file.path) } } }, // Store multiple images
        { new: true }
      );
  
      // Check if event exists
      if (!updatedEvent) {
        return res.status(404).json({ message: "Event not found." });
      }
  
      return res.status(200).json({
        message: "Event images uploaded successfully.",
        profileImage: updatedEvent.profileImage,
      });
    } catch (error) {
      console.error("Error uploading images:", error);
      return res.status(500).json({
        message: "Error uploading event images.",
        error: error.message,
      });
    }
  };
  

// @Desc Get All Events
// @route /api/v1/events/
// @Access Admin
const getAllEvents = asynchandler(async (req, res) => {
  const events = await Events.find({});
  res.status(200).json({
    success: true,
    data: events,
    message: events.length ? "Events Fetched Successfully" : "No Events Found",
  });
});

// @Desc Get Particular Event
// @route /api/v1/events/:id
// @Access Admin
const getEventById = asynchandler(async (req, res) => {
  const { id } = req.params;

  try {
    const event = await Events.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: `No Event Found with ID: ${id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid Event ID" });
    }
    throw error;
  }
});

// @Desc Edit or Update Event
// @route /api/v1/events/:id
// @Access Admin
const updateEvent = asynchandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, date, location } = req.body;

  // Find and update event
  const event = await Events.findByIdAndUpdate(
    id,
    { title, description, date, location },
    { new: true, runValidators: true }
  );

  if (!event) {
    return res.status(404).json({
      success: false,
      message: `No Event Found with ID: ${id}`,
    });
  }

  res.status(200).json({
    success: true,
    data: event,
    message: "Event Updated Successfully",
  });
});

// @Desc Delete particular Event
// @route /api/v1/events/:id
// @Access Admin
const deleteEvent = asynchandler(async (req, res) => {
  const { id } = req.params;

  try {
    const event = await Events.findByIdAndDelete(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: `No Event Found with ID: ${id}`,
      });
    }

    res.status(200).json({
      success: true,
      message: "Event Deleted Successfully",
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid Event ID" });
    }
    throw error;
  }
});

// @Desc Register volunteer for an event
// @Route POST /api/v1/volunteers/join/:id
// Acsesss Public
const joinEvent = async (req, res) => {
  const { name, email, mobile } = req.body;
  const { eventId } = req.params;

  // Check if volunteer already exists by email
  let volunteer = await Volunteer.findOne({ email });
  if (!volunteer) {
    // If volunteer doesn't exist, create new volunteer
    volunteer = await Volunteer.create({ name, email, mobile, event: [eventId] });
  } else {
    // If volunteer already exists, check if they have already joined the event
    if (volunteer.event.includes(eventId)) {
      return res.status(400).json({ message: "Volunteer already joined this event." });
    }

    // Add the event to the volunteer's event list
    volunteer.event.push(eventId);
    await volunteer.save();
  }

  return res.status(201).json({
    success: true,
    data: volunteer,
  });
};



export {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  uploadEventGallery,
  joinEvent
};
