export const haversineDistance = (coords1: [number, number], coords2: [number, number], ) => {
    function toRad(x:number) {
      return x * Math.PI / 180;
    }
  
    const lon1 = coords1[0];
    const lat1 = coords1[1];
  
    const lon2 = coords2[0];
    const lat2 = coords2[1];
  
    const R = 6371; // km
  
    const x1 = lat2 - lat1;
    const dLat = toRad(x1);
    const x2 = lon2 - lon1;
    const dLon = toRad(x2)
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
  
    return d;
  }