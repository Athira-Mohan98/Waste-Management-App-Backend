const express = require('express')
const userController = require('../Controller/userController')
const jwtMiddleware = require('../Middlewares/jwtMiddleware')
const WasteController = require('../Controller/WasteController')
const ContactController = require('../Controller/ContactController')
const ReplyController = require('../Controller/ReplyController')
const multerMiddleware = require('../Middlewares/multerMiddleware')
const route = new express.Router()

//------------------------User------------------------------
route.post('/api/register', userController.register)
route.post('/api/login', userController.login)
route.post('/api/google-login', userController.googleAuth)
route.post('/api/schedulePickup', jwtMiddleware, WasteController.schedulePickup)
route.post('/api/contact', jwtMiddleware, ContactController.contact)
route.get('/api/allpickups', jwtMiddleware, WasteController.allpickups)
route.post('/api/store', jwtMiddleware, userController.Purchase)
route.put('/api/user/update', jwtMiddleware,multerMiddleware.single('profilephoto'),userController.updateProfile) // to update profile in settings
route.delete('/api/delete/:id', jwtMiddleware, WasteController.deleterequest)
route.get('/api/allorders', jwtMiddleware, userController.allorders)
route.get('/api/user/details', jwtMiddleware, userController.getUserDetails)
route.get('/api/replies', jwtMiddleware,ReplyController.getUserReplies)
route.delete('/api/deletemessage/:id', jwtMiddleware,ReplyController.deleterequests)
route.put('/api/makepayment',jwtMiddleware,userController.makePayment)
route.post('/api/schedule-feedback', jwtMiddleware, userController.scheduleFeedback)


//----------------------------------ADMIN PART-------------------------------------------
route.get('/api/pending-pickups', jwtMiddleware, WasteController.getPendingPickups)
route.put('/api/admin-approval/:id', jwtMiddleware, WasteController.adminapprove)
//admin requests page
route.get('/api/pending-suggestions', jwtMiddleware, ContactController.getsuggestions)
route.get('/api/pending-issues', jwtMiddleware, ContactController.getissues)
//Admin agents page
route.get('/api/pending-agents', jwtMiddleware, ContactController.getAgents)
route.get('/api/admin-activeagents', jwtMiddleware, ContactController.getActiveAgents)
route.put('/api/admin-approvedagent', jwtMiddleware, ContactController.adminapproveAgent)
route.delete('/api/admin-rejectagent', jwtMiddleware, ContactController.adminRejectAgent)
route.delete('/api/deleteagent/:id', jwtMiddleware, ContactController.deleteAgentrequest)
route.put('/api/admin-editagent', jwtMiddleware, ContactController.admineditAgent)
route.post('/api/sendReply', jwtMiddleware, ReplyController.sendResponse)
route.put('/api/admin/update', jwtMiddleware,multerMiddleware.single('profilephoto'),userController.updateAdminProfile) // to update profile in settings
route.get('/api/admin/details', jwtMiddleware, userController.getadminDetails)
route.get('/api/pending-agentissues', jwtMiddleware, ContactController.getagentissues)


//--------------------------------------Agent Part---------------------------------------------
route.get('/api/pending-agentpickups', jwtMiddleware, WasteController.getPendingAgentPickups) //dashboard
route.get('/api/pending-agentTodayPickups', jwtMiddleware, WasteController.getPendingAgentTodayPickups)//pickup page
route.put('/api/Pickup-approval/:id', jwtMiddleware, WasteController.agentPickupapprove)//pickup approved
route.put('/api/agent/update', jwtMiddleware,multerMiddleware.single('profilephoto'),userController.updateAgentProfile) // to update profile in settings
route.get('/api/agent/details', jwtMiddleware, userController.getagentDetails)
route.get('/api/agent/pickuphistory', jwtMiddleware, WasteController.getpickupHistory)
route.post('/api/agentissues', jwtMiddleware, ContactController.submitagentissues)
route.get('/api/agent-replies', jwtMiddleware,ReplyController.getAgentReply)
route.delete('/api/agent-deletemessage/:id', jwtMiddleware,ReplyController.deleteagentrequests)
route.delete('/api/agent-pickuphistory/:id', jwtMiddleware,WasteController.deletepickuphistory)







module.exports = route;
