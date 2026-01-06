
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";


const loginConroller = asyncHandler( (req: any, res: any) => {
    const { username, password } = req.body;
    console.log("Login successful");
    res.status(200).json({message : "Login successful from server"});
    //  return res.status(200).json(
    //   new ApiResponse(
    //     true,
    //     200,
    //     "Login successful fromm server",
    //     "data from server" // or real user data later
    //   )
    // )
});

const logoutConroller = (req: any, res: any) => {
    // Logout logic here
    res.send("Logout successful");
}   

const signupConroller = (req: any, res: any) => {
    // Signup logic here
    res.send("Signup successful");
}

export { loginConroller, logoutConroller, signupConroller };