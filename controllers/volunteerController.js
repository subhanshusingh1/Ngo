// // import modules
// import asynchandler from "express-async-handler";

// // import files
// import Volunteer from "../models/Volunteer.js";

// // @Desc Add Volunteer
// // @route Post /api/v1/volunteer/
// // @Access Public
// const addVolunteer = asynchandler(async (req, res) => {
//   // get input from user
//   const { name, email, mobile } = req.body;

//   // check if volunteer already exists
//   const volunteerInfo = await Volunteer.findOne({ name });

//   if (volunteerInfo) {
//     return res.status(400).send({ message: "Volunteer Already exists" });
//   }

//   // Add Volunteer
//   const volunteer = await Volunteer.create({
//     name,
//     email,
//     mobile
//   });

//   // show response
//   if (volunteer) {
//     res.status(201).json({
//       success: true,
//       data: {
//         _id: volunteer._id,
//         name: volunteer.name,
//         email: volunteer.email,
//         mobile: volunteer.mobile,
//       },
//     });
//   } else {
//     res.status(500).json({
//       success: false,
//       message: `Volunteer can't be Added`,
//     });
//   }
// });

// // @Desc Fetch All Volunteer Details
// // @route /api/v1/volunteer/
// // @Access Admin
// const getAllVolunteer = asynchandler(async (req, res) => {

//   // Get Volunteer Details
//   const volunteerInfo = await Volunteer.find({});

//   if (volunteerInfo.length === 0) {
//     return res.status(404).json({ message: "No Volunteer Found" });
//   }

//   // show response
//   res.status(200).json({
//     success:true,
//     data: {
//         volunteerInfo
//     },
//     message: `Volunteer Details Fetched Successfully`
//   })
// });

// // @Desc Get Particular Volunteer Details
// // @route /api/v1/volunteer/:id
// // @Acess Admin
// const getVolunteerById = asynchandler(async (req, res) => {
//   // get event id
//   const { id } = req.params;

//   // check if event exist
//   const volunteerInfo = await Volunteer.findById(id);

//   if (!volunteerInfo) {
//     return res.status(404).json({
//       message: `No Volunteer Found with id: ${id}`,
//     });
//   }

//   // show response
//   res.status(200).json({
//     success: true,
//     data: {
//         volunteerInfo
//     },
//     message: `Volunteer Details Fetched Successfully`
//   })
// });

// // @Desc Edit or Update Volunteer Details
// // @route /api/v1/volunteer/:id
// // @Access 
// const updateVolunteerDetails = asynchandler(async (req, res) => {
//   // Get Volunteer Id
//   const { id } = req.params;

//   // Check if volunteer exists
//   const volunteerInfo = await Volunteer.findById(id);

//   if (!volunteerInfo) {
//     res.status(404).json({
//       message: `Not Volunteer found with id: ${id}`,
//     });
//   }

//   // Get Event Details
//   const { name, email, mobile } = req.body;

//   // update value provided by user in Event Database
//   volunteerInfo.name = name;
//   volunteerInfo.email = email;
//   volunteerInfo.mobile = mobile;

//   // save this updated data to Event Database
//   await volunteerInfo.save();

//   // show response
//   res.status(200).json({
//     success:true,
//     data: {
//         volunteerInfo
//     },
//     message: `Volunteer Details Updated Successfully`
//   })
// });

// // @Desc Remove particular Volunteer
// // @route /api/v1/volunteer/:id
// // @Access 
// const removeVolunteer = asynchandler(async (req, res) => {
//   // Get Volunteer Id
//   const { id } = req.params;

//   // Check if Event exists
//   const volunteerInfo = await Volunteer.findById(id);

//   if (!volunteerInfo) {
//     res.status(404).json({
//       message: `No Volunteer Exists with id: ${id}`,
//     });
//   }

//   // delete Event from Event Database
//   await volunteerInfo.deleteOne({_id:id})

//   // show response
//   res.status(200).json({
//     success:true,
//     message:`Volunteer Removed Successfully`
//   })
// });

// export { addVolunteer, getAllVolunteer, getVolunteerById, updateVolunteerDetails, removeVolunteer };
