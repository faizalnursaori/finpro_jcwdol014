import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import { loginUser } from '@/lib/ApiClient';
import { getUserByEmail, createUser } from '@/api/user';
// import { getWarehouseByUserId } from '@/api/warehouse';

const handler = NextAuth({
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials, req) {
        const { email, password } = credentials;
        const user = await loginUser(email, password);

        return user.data;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
      async profile(profile) {
        const user = await getUserByEmail(profile.email);
        if (user.data === null) {
          const Userdata = {
            email: profile.email,
            username: profile.name,
            provider: 'google',
          };
          const newUser = await createUser(Userdata);
          return newUser.data;
        }

        return user.data;
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
      async profile(profile) {
        const user = await getUserByEmail(profile?.email);
        if (!user?.data?.email) {
          const Userdata = {
            email: profile.email,
            username: profile.name,
            provider: 'github',
          };
          const newUser = await createUser(Userdata);
          return newUser.data;
        }
        return user.data;
      },
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.username = user.username;
        token.isVerified = user.isVerified;
        token.id = user.id;
        token.role = user.role;
        token.image = user.image;
        token.name = user.name;
        token.dob = user.dob;
        token.mobileNumber = user.mobileNumber;

        // Tambahkan warehouse ke token jika user ada
        // if (user.role === 'ADMIN') {
        //   const warehouse = await getWarehouseByUserId(user.id);
        //   token.warehouse = warehouse; // Tambahkan warehouse
        // } else {
        //   token.warehouse = null; // Tidak memiliki akses ke warehouse
        // }
      }
      if (trigger === 'update' && session.username) {
        const updateUser = await getUserByEmail(session.email);
        token.username = session.username;
        token.email = session.email;
        token.image = updateUser?.data?.image;
        token.isVerified = updateUser?.data.isVerified;
        token.name = updateUser?.data?.name;
        token.gender = updateUser?.data?.gender;
        token.dob = updateUser?.data?.dob;
        token.mobileNumber = updateUser?.data?.mobileNumber;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.username = token.username;
        session.user.isVerified = token.isVerified;
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.image = token.image;
        session.user.gender = token.gender;
        session.user.name = token.name;
        session.user.dob = token.dob;
        session.user.mobileNumber = token.mobileNumber;

        // Tambahkan warehouse ke session user
        // session.user.warehouse = token.warehouse;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
});

export { handler as GET, handler as POST };
