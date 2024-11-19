class Validation{

  static name(name){
    if (typeof name !== 'string') throw new Error ('Name must be a string')

      if(name.length<3) throw new Error("Name be at least 3 characters long");
  }



  static email(email){
    if (typeof email !== 'string') throw new Error ('Email must be a string')

    if(email.length<3) throw new Error("Email be at least 3 characters long");
  }

  static password(password){
    if (typeof password !== 'string') throw new Error ('Password must be a string')

    if(password.length<6) throw new Error("Password be at least 6 characters long");
  }

}

export default Validation



// export const checkRolesExisted = async (req,res,next) =>{

//   const {roles} = req.body

//   try {
//     const roleFound = await Role.findOne({name: {$eq: roles}})
    
//     if(!roleFound){
//       return res.status(400).json({message: `Role ${roles} does not exist`})
//     }
//     next();
  
//     }catch(error){
//       res.status(500).json({message:error.message})
//     }

// }

