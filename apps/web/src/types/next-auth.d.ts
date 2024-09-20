import 'next-auth';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    user: {
      id: string;
      username: string;
      email: string;
      isVerified: boolean;
      role: string;
      image: string;
      name: string;
      dob: string;
      mobileNumber: string;
      gender: string;
    };
  }
}
