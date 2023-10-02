
const deps=["system administrator","finance","logistics"]

export function checkNavigator(role) {
  console.log("navigator",role)
  if (role.toLowerCase()==deps[0]) {
    return "it";    
  }
  if (role.toLowerCase()==deps[1]) {
    return "finance";    
  }
  if (role.toLowerCase()==deps[2]) {
    return "logistics";    
  }
  else{
    return "";
  }
}