export const getUserCurrentLocation = () =>{
    const userLoc = {
        lon: 0,
        lat: 0
    } 
    const success = (res: any) => {
        userLoc.lon = Number(res.coords.longitude)
        userLoc.lat = Number(res.coords.latitude);
      };
    
      const fail = (res: any) => {
        console.log(res);
      };


    navigator.geolocation.getCurrentPosition(success, fail)
    
    console.log('ini user location',userLoc);
    
    return userLoc;
}