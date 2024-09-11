import { Request, Response } from 'express';
import prisma from '@/prisma';
import bcrypt, { genSalt } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { hashPassword } from '@/utils/auth.utils';
import { transporter } from '@/utils/auth.utils';

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const imageUrl = req.file ? `/profile/${req.file.filename}` : data.image;
    
    if(data.isVerified == 'true') {
      data.isVerified = true
    } else if(data.isVerified == 'false') {
      data.isVerified = false
    }

    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: {...data, image: imageUrl}
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
        }
    })

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