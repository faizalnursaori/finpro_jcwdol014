export const getUserCurrentLocation =  () =>{
    const userLoc: any = [] 
    const success = async (res: any) => {
        await userLoc.push(Number(res.coords.longitude)) ;
        await userLoc.push(Number(res.coords.latitude));
      };
    
      const fail = (res: any) => {
        console.log(res);
      };


     navigator.geolocation.getCurrentPosition(success, fail)
    
    
    return userLoc;
}