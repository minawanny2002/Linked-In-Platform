export const allMiddleWare = (...functions)=>{
    return async(parent, argsToArgsConfig, context)=>{
        let resolver = functions[0];
        const [, ...middleWares] = functions
        for (const middleware of middleWares.reverse()) {
            resolver = middleware(resolver);
            
        }
        return resolver(parent, argsToArgsConfig, context)
    }
}