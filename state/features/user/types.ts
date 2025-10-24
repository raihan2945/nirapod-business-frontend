export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  // Add other user properties here
}

export interface UserState {
  data?: User;
}

export interface UserResponse {
    data: User;
  }  

export interface UpdateUserData {
  // Define the shape of data to be updated
  name?: string;
  email?: string;
  // other fields
}
