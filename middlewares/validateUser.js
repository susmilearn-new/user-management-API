const validateUser = (req, res, next)=>{
    const{name, gender, email} = req.body;

    if(!name || !gender || !email){
        return res.status(400).json({
            success: false,
            message: "Name, gender and email are mandatory"
        })
    }
    next()
}

module.exports = validateUser