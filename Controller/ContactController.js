const Contactmodel = require('../Model/ContactModel')

//to contact via form

exports.contact = async (req, res) => {
  try {
    const { name, email, phone, city, subject, message, age } = req.body
    console.log(req.body);

    const newContactRequest = new Contactmodel({
      name,
      email,
      phone,
      city,
      subject,
      message,
      age,
      status: 'Pending'
    })
    await newContactRequest.save()
    res.status(200).json(newContactRequest)

  } catch (err) {
    res.status(500).json( err);
  }
}

exports.getsuggestions = async (req, res) => {

  try {
    const pendingsuggestions = await Contactmodel.find({ status: 'Pending', subject: 'Suggestion' })
    res.status(200).json(pendingsuggestions);
  } catch (err) {
    res.status(500).json(err);
  }
}

exports.getissues = async (req, res) => {

  try {
    const pendingissues = await Contactmodel.find({ status: 'Pending', subject: 'Report an Issue' ,email: { $ne: 'agent@gmail.com' }})
    res.status(200).json(pendingissues);
  } catch (err) {
    res.status(500).json(err);
  }
}

exports.getagentissues = async (req, res) => {

  try {
    const pendingagentissues = await Contactmodel.find({ status: 'Pending', subject: 'Report an Issue', email: 'agent@gmail.com' });
    res.status(200).json(pendingagentissues);
  } catch (err) {
    res.status(500).json(err);
  }
}

exports.getAgents = async (req, res) => {

  try {
    const pendingAgentApplications = await Contactmodel.find({ status: 'Pending', subject: 'Join as collection agent' });
    res.status(200).json(pendingAgentApplications);
  } catch (err) {
    res.status(500).json(err);
  }
}

exports.adminapproveAgent = async (req, res) => {

  const {_id, name, email, age, phone, status } = req.body

  try {
    const Agent = await Contactmodel.findByIdAndUpdate(
      _id, { name, email, age, phone, status: 'Active' }, { new: true });
    if (!Agent) {
      res.status(404).json("Agent not found");
    } else {
      res.status(200).json(Agent)
    }


  } catch (error) {
    console.error(error)
  }
}

exports.adminRejectAgent = async (req, res) => {

  const { _id, reason } = req.body

  try {

    await Contactmodel.findByIdAndDelete(_id);
    res.status(200).json(reason);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.getActiveAgents = async (req, res) => {
  try {
    const activeAgents = await Contactmodel.find({ status: 'Active' })
    res.status(200).json(activeAgents)
  } catch (err) {
    console.error(err)
  }
};

exports.deleteAgentrequest = async (req, res) => {
  try {
    const { id } = req.params;
    await Contactmodel.findByIdAndDelete(id)
    res.status(200).json({ message: "Agent deleted successfully" })
  } catch (error) {
    res.status(500).json(error);
  }
}

exports.admineditAgent = async (req, res) => {

  const { _id, name, city, age, status } = req.body

  try {
    const UpdatedAgent = await Contactmodel.findByIdAndUpdate(
      _id, { name, city, age, status }, { new: true });
    if (!UpdatedAgent) {
      res.status(404).json({ message: "Agent not found" });
    } else {
      res.status(200).json(UpdatedAgent)
    }


  } catch (error) {
    console.error(error)
  }
}

exports.submitagentissues = async (req, res) => {
  try {
    const {name, email,phone,city, subject, message, status } = req.body;

    if (!email || !subject || !message) {
      res.status(400).json( "Please fill required fields" );
    }
else{
  const newIssue = new Contactmodel({
      name,
      email,
      phone,
      city,
      subject,
      message,
      status: status || "Pending"
    });

    await newIssue.save()
    res.status(200).json("Issue submitted successfully" );
}
  
  } catch (err) {
    res.status(500).json({ error: "Error while submitting the issue" });
  }
}


