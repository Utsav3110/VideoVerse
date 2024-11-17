// asynchandler

const asyncHandler = (requestHandler)=> {
    return(res, req , next) =>{
        Promise.resolve(
            
            requestHandler(res, req, next))


        .catch((error)=> next(error))
    }
}



export {asyncHandler}