const Wastemodel = require('../Model/WasteModel');

// to Schedule Pickup by user
exports.schedulePickup = async (req, res) => {

  try {
    const userId = req.user._id
    const { username, phone, address, wasteType, date, timeSlot } = req.body;

    console.log(req.body);

    const newPickup = new Wastemodel({
      username,
      phone,
      address,
      wasteType,
      date,
      timeSlot,
      status: 'AwaitingApproval',
      userId
    });
    await newPickup.save();
    res.status(200).json(newPickup);
  }
  catch (err) {
    res.status(500).json({ err });
  }
};


//to get all pickuprequest history(user)

exports.allpickups = async (req, res) => {

  try {
    const { id } = req.params
    const allPickups = await Wastemodel.find({ id }).sort({ createdAt: -1 })
    res.status(200).json(allPickups);
  } catch (error) {
    res.status(500).json(error);
  }
};

//to delete request

exports.deleterequest = async (req, res) => {
  try {
    const { id } = req.params;
    await Wastemodel.findByIdAndDelete(id)
    res.status(200).json("Pickup deleted successfully")
  } catch (error) {
    res.status(500).json(error);
  }
}


// to Get All Pending Pickups (Admin)

exports.getPendingPickups = async (req, res) => {

  try {
    const pendingPickups = await Wastemodel.find({ status: 'AwaitingApproval' });
    res.status(200).json(pendingPickups);
  } catch (err) {
    res.status(500).json(err);
  }
}

exports.adminapprove = async (req, res) => {

  try {
    const { id } = req.params
    const { agent } = req.body
    const adminApproval = await Wastemodel.findByIdAndUpdate(id, { status: 'Pending', SelectedAgent: agent , approvedByAdmin: true}, { new: true })

    if (!adminApproval) {
      res.status(404).json("No pickups")
    }

    res.status(200).json(adminApproval)
  } catch (error) {
    res.status(500).json(error)
  }
}

//dashboard
exports.getPendingAgentPickups = async (req, res) => {
  try {
    const pendingAgentPickups = await Wastemodel.find({ status: 'Pending', approvedByAdmin: true });
    res.status(200).json(pendingAgentPickups)
  } catch (err) {
    res.status(500).json(err);
  }
}

exports.getPendingAgentTodayPickups = async (req, res) => {
  try {
    const todaydate = new Date().toISOString().slice(0, 10);
    const pendingAgentTodayPickups = await Wastemodel.find({ status: 'Pending', date: todaydate, approvedByAdmin: true });
    res.status(200).json(pendingAgentTodayPickups)
  } catch (err) {
    res.status(500).json(err);
  }
}

exports.agentPickupapprove = async (req, res) => {

  try {
    const { id } = req.params
    const updatedPickup = await Wastemodel.findByIdAndUpdate(id, { status: 'completed' }, { new: true })

    if (!updatedPickup) {
      res.status(404).json("No pickups")
    }

    res.status(200).json(updatedPickup)
  } catch (error) {
    res.status(500).json(error)
  }
}



exports.getpickupHistory = async (req, res) => {

  try {
    const allPickuphistory = await Wastemodel.find({ status: 'completed' }).sort({ createdAt: -1 })
    res.status(200).json(allPickuphistory);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.deletepickuphistory=async(req,res)=>{
  try {
    const { id } = req.params
    await Wastemodel.findByIdAndDelete(id)
    res.status(200).json("User pickup history deleted successfully")

  } catch (error) {
    res.status(500).json(error)
  }
}