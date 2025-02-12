const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next))
            .catch(error => next(error));
    };
};

export { asyncHandler };




/*const asynchandler=(fn)=>async(req,res,next)=>{
    try {
        await fn(req,res,next)
        
    } catch (error) {
        res.status(error.code||5000).json({
            sucess:false,
            message:error.message
        })
        
    }
}*/
