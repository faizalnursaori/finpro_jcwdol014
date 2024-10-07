export const getUserCurrentLocation = async () =>{
    const userLoc: any = [] 
    const success =  (res: any) => {
         userLoc.push(Number(res.coords.longitude)) ;
         userLoc.push(Number(res.coords.latitude));
         return [res.coords.longitude, res.coords.latitude]
      };
    
      const fail = (res: any) => {
        console.log(res);
      };


    navigator.geolocation.getCurrentPosition(success, fail)
  
}