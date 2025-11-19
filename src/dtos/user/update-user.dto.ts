export type UpdateUserDto = {
  username: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  client: string;
  profileDetails: ProfileDetails | any;
  avatar: string;
};

export type ProfileDetails = {
  age: number;
  address: string;
  preferences: Preferences;
};

export type Preferences = {
  newsletter: boolean;
  notifications: boolean;
};
