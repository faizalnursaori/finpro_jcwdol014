import { Request, Response } from 'express';
import prisma from '@/prisma';
import bcrypt, { genSalt } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { transporter } from '@/utils/auth.utils';
import { configDotenv } from 'dotenv';
import { Role } from '@prisma/client';

interface LoginPayload {
  userId: number;
  email: string;
  username: string;
  role: Role;
  iat: number;
  warehouseId?: number;
}

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const prevUserData = await prisma.user.findUnique({
      where: {id: Number(id)}
    })

    const imageUrl = req.file ? `/profile/${req.file.filename}` : prevUserData?.image;
    const dob = data.dob ? new Date(data.dob): prevUserData?.dob
    
    if(data.isVerified == 'true') {
      data.isVerified = true
    } else if(data.isVerified == 'false') {
      data.isVerified = false
    }

    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: {...data, image: imageUrl, dob}
    });

    res.status(200).json({ message: 'User data updated successfully!', user });
  } catch (error) {
    console.error('Error updating user data: ', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateUserByToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const data = req.body;
    const payload : any = jwt.verify(token, process.env.JWT_SECRET!)
    const password = data.password

    const salt = await genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
  

    const user = await prisma.user.update({
      where: { id: Number(payload.id) },
      data: {
        ...data, password: hashedPassword, isVerified: true
      }
    });

    res.status(200).json({ message: 'User data updated successfully!',  });
  } catch (error) {
    console.error('Error updating user data: ', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateUserPassword = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const password = updateData.password;

    const salt = await genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: { ...updateData, password: hashedPassword },
    });

    res.status(200).json({ message: 'User data updated successfully!', user });
  } catch (error) {
    console.error('Error updating user data: ', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const resetUserPassword = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const payload : any = jwt.verify(token, process.env.JWT_SECRET!)
    const {password} = req.body;
    console.log(req.body);
    

    const salt = await genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(hashedPassword);
    

    const user = await prisma.user.update({
      where: { id: payload.id },
      data: { password: hashedPassword },
    });

    res.status(200).json({ message: 'User password updated successfully!', user });
  } catch (error) {
    console.error('Error updating user password: ', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getUserByEmail = async (req: Request, res: Response) => {
  try {
    const {email} = req.params
    
    const user = await prisma.user.findUnique({
        where:{
            email: email
        },
        include: { warehouse: true },
    })

    const payload: LoginPayload = {
      userId: user?.id as number,
      email: user?.email as string,
      username: user?.username as string,
      role: user?.role as Role,
      iat: Date.now(),
    };

    if (user?.role === 'ADMIN' && user.warehouse) {
      payload.warehouseId = user.warehouse.id;
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: '24h',
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000,
    });

    res.status(200).json({ message: 'Getting user datas successfully!', data: user });

  } catch (error) {
    console.error('Error getting user data: ', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createUser = async (req: Request, res: Response) => {
  const {email, username, provider} = req.body

  try {
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: '',
        provider,
        carts: {
          create: {
            isActive: true,
          },
        },
      },
      include: {
        carts: true,
      },
    })
    
    res.status(201).json({message: 'User created!', data: user})
  } catch (error) {
    res.status(500).json({message: 'An error occured', error})
    
  }
}

export const verifyUser = async (req: Request, res: Response) => {
  const {email}= req.body
  const emailToken =  jwt.sign({
    email
  }, process.env.JWT_SECRET!, {
    expiresIn: '1h',
  });

  const url = `http://localhost:8000/api/users/verify/${emailToken}`;

  try {
    await transporter.sendMail({
      from: {
        name: 'Hemart',
        address: process.env.GMAIL_USER!
      },
      to: email,
      subject: 'Confirmation Email',
      html: `Please click this link to verify yourself : <a href="${url}">${url}<a/>`,
    });
    return res.status(200).json({message: 'Email sent!'})
  } catch (error) {
    console.log("error sending an email: ", error);
  }

}

export const confirmation = async(req:Request, res: Response) => {
  const {token} = req.params
  const payload: any = jwt.verify(token, process.env.JWT_SECRET!)
  const email = payload.email
  
  const user = await prisma.user.update({
    where: {email},
    data: {isVerified: true}
  })

  res.status(200).redirect('http://localhost:3000/profile/info/verified')

}