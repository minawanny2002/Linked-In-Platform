export const val = (schema)=>{
    return (resolver)=>{
        return async(parent, args, context)=>{
            console.log(schema);
            
            const {error} = schema.validate(args, {abortEarly:false})
            if(error){
                const messageList = error.details.map((obj)=>obj.message);
                throw new Error (messageList, {cause:400})
            }
            return resolver(parent, args, context)
        }
    }
}