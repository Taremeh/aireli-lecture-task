import { PlatformAccessToken, PlatformUserCreateInput, PlatformUser } from '@enterprise-commerce/core/platform/types';
import axios from 'axios';
import { log } from 'console';
import { Request, response, Response } from 'express';
import jwt from 'jsonwebtoken';

const registerUser = async (input: PlatformUserCreateInput): Promise<Pick<PlatformUser, "id"> | undefined | null> => {
  const user: PlatformUser = {"id": "-1"}
  try {
    if(input.email != "" && input.password != "") {
    await axios.post('http://localhost:3001/register', {"email": input.email, "password": input.password}).then(function (response) {
    user.id = response.data.user.id;
    user.email = response.data.user.email
    return user;
  }).catch(function (error) {
    console.log(error);});
    
    } else {
      console.log("No input data provided!");
    }
  } catch (error) {
    console.log("Error while registering user in client: ", error)
  }
  if (user.id != "-1") {
    return user;
  } else {
    return null;
  }
};

const loginUser = async (input: PlatformUserCreateInput) => {
  // ToDo: Implement the loginUser function (someone else is working on it)
  const user = {id: null} // replace this line


  // The following lines can be left unchanged because the output is expected to be a JWT token and an expiresAt value
  const accessToken = jwt.sign({ id: user?.id }, process.env.JWT_SECRET || "no_key_set" as string, { expiresIn: '1h' });
  const expiresAt = new Date(Date.now() + 3600 * 1000).toISOString(); // 3600 seconds = 1 hour
  return { accessToken, expiresAt };
};

const getUser = async (accessToken: string): Promise<PlatformUser | undefined | null> => {
  try {
    if(accessToken != "") {
      const { data } = await axios.get('http://localhost:3001/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return data.user;
    } else {
      return null
    }
  } catch (error) {
    console.error(error);
    // Handle error
    return null;
  }
};

export default {
  registerUser,
  loginUser,
  getUser
};