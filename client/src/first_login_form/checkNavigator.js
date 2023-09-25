
const deps=["system administrator","finance"]

export function checkNavigator(role) {
  console.log("navigator",role)
  if (role.toLowerCase()==deps[0]) {
    return "it";    
  }
  if (role.toLowerCase()==deps[1]) {
    return "finance";    
  }
  else{
    return "";
  }
}