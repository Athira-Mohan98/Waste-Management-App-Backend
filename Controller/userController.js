const users = require('../Model/UserModel')
const jwt = require('jsonwebtoken')
const stripe = require('stripe')(process.env.STRIPE)
const { sendLoginEmail } = require('../Email/EmailSender')

//1. Register

exports.register = async (req, res) => {
    const { username, email, password } = req.body
    try {
        const existingUser = await users.findOne({ email })
        if (existingUser) {
            res.status(401).json("User already existing....")
        } else {
            const newUser = new users({
                username,
                email,
                password
            })
            await newUser.save()
            res.status(200).json(newUser)
        }

    } catch (err) {
        res.status(500).json(err)
    }
}

exports.login = async (req, res) => {
 
  const { email, password } = req.body;
  try {
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      if (existingUser.password == password) {
    
        const token = jwt.sign(
          { email: existingUser.email },
          'secretkeyaug2025'
        );
        console.log(token);

        res.status(200).json({ existingUser, token })
      } else {
        res.status(402).json("Password Missmatch");
      }
    } else {
      res.status(401).json("Something went wrong...");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};


exports.googleAuth = async (req, res) => {
    const { username, email, password, photo } = req.body
    try {
        const existingUser = await users.findOne({ email })
        if (existingUser) {

            const token = jwt.sign({ _id: existingUser._id, email: existingUser.email, role: existingUser.role }, 'secretkeyaug2025')
            console.log(token);

            res.status(200).json({ existingUser, token })
        }
        else {
            const newUser = new users({
                username,
                email,
                password,
                profile: photo
            })
            await newUser.save()
            const token = jwt.sign({ userMail: newUser.email }, 'secretkeyaug2025')
            console.log(token);
            res.status(200).json({ existingUser: newUser, token })
        }

    } catch (err) {
        res.status(500).json(err)
    }
}


exports.Purchase = async (req, res) => {
    const { itemName, price, date } = req.body;
    try {
        const userEmail = req.user.userMail;
        const updatedUser = await users.findOneAndUpdate({ email: userEmail }, { $push: { purchases: { itemName, price, date } } }, { new: true });

        if (!updatedUser) {
            res.status(404).json({ message: 'User not found' });
        }
        else {
            res.status(200).json(updatedUser.purchases);
        }

    } catch (error) {

        res.status(500).json('Server Error', error);
    }
};

exports.updateProfile = async (req, res) => {
    const { username, password, profilephoto } = req.body
    const pro = req.file ? req.file.filename : profilephoto
    const email = req.user.email
    try {
        const userDetails = await users.findOneAndUpdate({ email }, { username, password, profilephoto: pro }, { new: true })
        res.status(200).json(userDetails)
    }
    catch (err) {
        res.status(500).json(error);
    }

}

exports.allorders = async (req, res) => {
    try {
        const userEmail = req.user.email
        console.log(userEmail);
        const user = await users.findOne({ email: userEmail }, 'purchases')
        if (!user)
             { res.status(404).json('User not found' ) 

             }
        else {
            res.status(200).json(user.purchases)
        }
    } catch (err) {
        res.status(500).json(error)
    }
}

exports.getUserDetails = async (req, res) => {
    const email = req.user.email
    try {
        const user = await users.findOne({ email })
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json( "User not found" );
        }
    } catch (err) {
        res.status(500).json(error);
    }
}

exports.updateAdminProfile = async (req, res) => {
    const { username, password, profilephoto } = req.body
    const pro = req.file ? req.file.filename : profilephoto
    const email = req.user.userMail
    try {
        const adminDetails = await users.findOneAndUpdate({ email }, { username, password, profilephoto: pro }, { new: true })
        res.status(200).json(adminDetails)
    }
    catch (err) {
        res.status(500).json(err);
    }

}

exports.getadminDetails = async (req, res) => {
    const email = req.user.email
    try {
        const admin = await users.findOne({ email });
        if (admin) {
            res.status(200).json(admin);
        } else {
            res.status(404).json( "admin is not found" );
        }
    } catch (err) {
        res.status(500).json(error);
    }
}


exports.updateAgentProfile = async (req, res) => {
    const { username, password, profilephoto } = req.body
    const pro = req.file ? req.file.filename : profilephoto
    const email = req.user.email
    try {
        const agentDetails = await users.findOneAndUpdate({ email }, { username, password, profilephoto: pro }, { new: true })
        console.log(agentDetails);
        
        res.status(200).json(agentDetails)
    }
    catch (err) {
        res.status(500).json(err);
    }

}

exports.getagentDetails = async (req, res) => {
    const email = req.user.email

    try {
        const agent = await users.findOne({ email });
        if (agent) {
            res.status(200).json(agent);
        } else {
            res.status(404).json("agent is not found" );
        }
    } catch (err) {
        res.status(500).json(err);
    }
}


exports.makePayment = async (req, res) => {
    console.log("inside make payment");

    const { Purchaseditems } = req.body;
    console.log(Purchaseditems);
    const email = req.user.email
    console.log(email);

    try {

        const existingPurchase = await users.findOneAndUpdate({ email }, {
            itemName: Purchaseditems.itemName,
            price: Purchaseditems.price,
            date: new Date()
        }, { new: true })
        console.log(existingPurchase);


        const line_item = [{
            price_data: {
                currency: 'usd',
                product_data: {
                    name: Purchaseditems.itemName,
                },
                //doller conversion
                unit_amount: Math.round(Purchaseditems.price * 10)
            },
            quantity: 1
        }]

        //create stripe checkout session
        const session = await stripe.checkout.sessions.create({
            //purchase using card
            payment_method_types: ["card"],
            //details of book
            line_items: line_item,
            //make payment
            mode: 'payment',
            //if payment is successful then redirected to payment success page
            success_url: 'http://localhost:5173/payment-success',

            //if payment is unsuccessful then redirected to payment error page
            cancel_url: 'http://localhost:5173/payment-failure',
        });
        console.log(session);
        res.status(200).json({ sessionID: session.id, existingPurchase })

    } catch (error) {
        res.status(500).json("error" + error)
    }
}


exports.scheduleFeedback = async (req, res) => {
    try {
        const useremail = req.user.email
        const { rating, comment } = req.body

        const user = await users.findOneAndUpdate({ email: useremail }, { $set: { scheduleFeedback: { rating, comment } } }, { new: true });
        if (!user) {
            res.status(404).json('User not found' );
        } else {
            res.status(200).json('Feedback saved successfully' );
        }
    }
    catch (err) {
        res.status(500).json(err)
    }
}




