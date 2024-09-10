import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from 'next-auth/providers/google'
import GithubProvider from 'next-auth/providers/github'
import { loginUser } from "@/lib/ApiClient";
import { getUserByEmail, createUser } from "@/api/user";



const handler = NextAuth({
    session: {
        strategy: 'jwt'
    },
    providers: [
        CredentialsProvider({
            async authorize(credentials, req) {
                const {email, password} = credentials;
                const user = await loginUser (email, password)
                

                return user.data
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID as string,
            clientSecret: process.env.GOOGLE_SECRET as string,
            async profile(profile) {
                const user = await getUserByEmail(profile.email)
                console.log("ini user yang sudah ada:", user);
                if(user.data === null){
                const Userdata = {email: profile.email, username: profile.name, provider: 'google'}
                const newUser = await createUser(Userdata)
                console.log("ini user baru:", newUser);
                return newUser.data
                }

                return user.data

            }
            

        }),
        GithubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
            async profile(profile) {
                const user = await getUserByEmail(profile.email)
                if(!user.data.email){
                const Userdata = {email: profile.email, username: profile.name, provider: 'github'}
                const newUser = await createUser(Userdata)
                return newUser.data
                }
                return user.data

            }

        }),
    ],
    pages:{
        signIn: '/login',
    },
    callbacks: {
        async jwt({token, user, trigger, session}) {
            if(user) {
                
                token.username = user.username
                token.isVerified = user.isVerified
                token.id = user.id
            }
            if(trigger === "update" && session.username){
                token.username = session.username
                token.email = session.email
                token.image = session.image
            }
            return token
        },
        async session({session, token}) {
            if(session.user) {
                session.user.username = token.username
                session.user.isVerified = token.isVerified
                session.user.id = token.id
            }
            return session
        }
    }
})

export { handler as GET, handler as POST }