import {
  ACCESS_TOKEN_EXPIRESIN,
  JWT_REFETCH_SECRET,
  JWT_SECRET,
  PROVIDER,
  REFETCH_TOKEN_EXPIRESIN,
  TEMPLATE_FILE_NAMES,
  WEBSITE_NAME
} from "../configs/constants";
import UserDTO from "../dto/user.dto";
import RoleRepository from "../repository/role.repository";
import UserRepository from "../repository/user.repository";
import { JwtPayload, ResponseEntry } from "../typings";
import { hash, verify } from "argon2";
import JsonWebToken from "jsonwebtoken";
import Mailer from "../helpers/mailer";
import {deleteObjectByKeys, GenerateToken} from "../helpers/utils";
import {ExcludeFields, ContactInput} from "../dto/user.dto";
import { v4 as uuidv4 } from "uuid";
import ContactRepository from "../repository/contact.repository";
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const axios = require('axios');
const date_format = require('date-format');

export async function register(
  email: string,
  password: string
): Promise<ResponseEntry<UserDTO | null>> {
  const User = new UserRepository();
  const Role = new RoleRepository();
  let text = fs.readFileSync(path.join(process.env.ROOT_FOLDER, process.env.FOLDER_TEMPLATE, TEMPLATE_FILE_NAMES.REGISTER), "utf8");
  let template = handlebars.compile(text);  
  let sixDigits = Math.floor(100000 + Math.random() * 900000);
  let data = {email: email, sixDigits: sixDigits.toString().split('')};
  let currentDate = new Date();
  currentDate.setMinutes(currentDate.getMinutes() + 10);

  /** Check existed user */
  try {
    const existUser = await User.getOneByEmail(email, PROVIDER.SYSTEM);
    if (existUser){
      if(!existUser.confirmed){
        if(password){
          const hashPassword = await hash(password);
          await User.updateUserInfor(existUser.id, {password: hashPassword, digit_number: sixDigits.toString(), expired_at: currentDate});
        }
        else{
          await User.updateUserInfor(existUser.id, {digit_number: sixDigits.toString(), expired_at: currentDate});
        }
        let mailerRes =  await Mailer.sendMail({
          from: process.env.EMAIL_USERNAME || "",
          to: email,
          subject: WEBSITE_NAME + " " + "confirmation", 
          html: template(data)
        });
        return {
          data: { ...deleteObjectByKeys(existUser,ExcludeFields), password: undefined },
          status: {
            code: 201,
            message: "Register success",
            success: true,
          },
        };
      }
      return {
        data: null,
        status: {
          code: 403,
          message: "Existed user!",
          success: false,
        },
      };
    }

    const role = await Role.getRole("user");
    const hashPassword = await hash(password);
    const newUser = await User.create({
      username: email,
      email: email,
      password: hashPassword,
      provider: PROVIDER.SYSTEM,
      confirmed: false,
      blocked: false,
      RoleId: role?.id as number,
      digit_number: sixDigits.toString(),
      expired_at: currentDate,
      full_name: email.split('@')[0]
    });
    if (!newUser)
      return {
        data: null,
        status: {
          code: 400,
          message: "Bad request! Can't register user!",
          success: false,
        },
      };
    
    let mailerRes =  await Mailer.sendMail({
      from: process.env.EMAIL_USERNAME || "",
      to: email,
      subject: WEBSITE_NAME + " " + "confirmation", 
      html: template(data)
    })
    // delete some fields
    delete newUser.expired_at;
    delete newUser.digit_number;

    return {
      data: { ...newUser, password: undefined },
      status: {
        code: 201,
        message: "Register success",
        success: true,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      data: null,
      status: {
        code: 500,
        message: "Internal Server Error",
        success: false,
      },
    };
  }
}

interface LoginRes {
  jwt: string;
  refetchJwt: string;
  user?: UserDTO;
}
export async function login(
  email: string,
  password: string
): Promise<ResponseEntry<LoginRes | null>> {
  const User = new UserRepository();
  try {
    /** Find user */
    const existUser = await User.getOneByEmail(email, PROVIDER.SYSTEM);
    if (!existUser)
      return {
        data: null,
        status: {
          code: 404,
          message: "Email or password incorrect!",
          success: false,
        },
      };

    try {
      /** Check password */
      const isCorrectPassword = await verify(
        existUser.password as string,
        password
      );
      if (!isCorrectPassword)
        return {
          data: null,
          status: {
            code: 404,
            message: "Email or password incorrect!",
            success: false,
          },
        };
      /** Check confirm account */
      if (!existUser.confirmed)
        return {
          data: null,
          status: {
            code: 404,
            message: "Account was not confirmed!",
            success: false,
          },
        };
      /** Check blocked account */
      if (existUser.blocked)
        return {
          data: null,
          status: {
            code: 404,
            message: "Account was blocked!",
            success: false,
          },
        };
      try {
        /** Generate token */
        const jwtPayload = { userId: existUser.id, roleId: existUser.RoleId };
        const token = JsonWebToken.sign(jwtPayload, JWT_SECRET, {
          expiresIn: `${ACCESS_TOKEN_EXPIRESIN}m`,
        });
        const refetchToken = JsonWebToken.sign(jwtPayload, JWT_REFETCH_SECRET, {
          expiresIn: `${REFETCH_TOKEN_EXPIRESIN}m`,
        });
        return {
          data: {
            jwt: token,
            refetchJwt: refetchToken,
            user: { ...existUser, password: undefined },
          },
          status: {
            code: 201,
            message: "Login successful!",
            success: true,
          },
        };
      } catch (error) {
        console.error(error);
        return {
          data: null,
          status: {
            code: 500,
            message: "Internal Server Error",
            success: false,
          },
        };
      }
      /** Return value */
    } catch (error) {
      console.error(error);
      return {
        data: null,
        status: {
          code: 404,
          message: "Email or password incorrect!",
          success: false,
        },
      };
    }
  } catch (error) {
    console.error(error);
    return {
      data: null,
      status: {
        code: 500,
        message: "Internal Server Error",
        success: false,
      },
    };
  }
}

export async function refetchToken(
  refetchJwt: string
): Promise<ResponseEntry<LoginRes | null>> {
  try {
    const decoded = JsonWebToken.verify(
      refetchJwt,
      JWT_REFETCH_SECRET
    ) as JwtPayload;
    const jwtPayload = { userId: decoded.userId, roleId: decoded.roleId };
    const token = JsonWebToken.sign(jwtPayload, JWT_SECRET, {
      expiresIn: `${ACCESS_TOKEN_EXPIRESIN}m`,
    });
    const refetchToken = JsonWebToken.sign(jwtPayload, JWT_REFETCH_SECRET, {
      expiresIn: `${REFETCH_TOKEN_EXPIRESIN}m`,
    });
    return {
      data: {
        jwt: token,
        refetchJwt: refetchToken,
        user: undefined,
      },
      status: {
        code: 201,
        message: "Login successful!",
        success: true,
      },
    };
  } catch (error) {
    return {
      data: null,
      status: {
        code: 406,
        message: "Unauthorized",
        success: false,
      },
    };
  }
}

export async function confirmation(
  email: string,
  digitnumber: string
): Promise<ResponseEntry<LoginRes | null>> {
  const User = new UserRepository();
  let currentDate = new Date();

  /** Check existed user */
  try {
    const existUser = await User.getOneByEmail(email, PROVIDER.SYSTEM);
    if (existUser && !existUser.confirmed && existUser.expired_at){
      if(existUser.expired_at < currentDate){
          return {
            data: null,
            status: {
              code: 403,
              message: "The code was expired.",
              success: false,
            },
          };
        }
        if(existUser.digit_number === digitnumber){
          /** Generate token */
          const jwtPayload = { userId: existUser.id, roleId: existUser.RoleId };
          const token = JsonWebToken.sign(jwtPayload, JWT_SECRET, {
            expiresIn: `${ACCESS_TOKEN_EXPIRESIN}m`,
          });
          const refetchToken = JsonWebToken.sign(jwtPayload, JWT_REFETCH_SECRET, {
            expiresIn: `${REFETCH_TOKEN_EXPIRESIN}m`,
          });
          const record = await User.updateUserInfor(existUser.id, {confirmed: true});
          return {
            data: {
              jwt: token,
              refetchJwt: refetchToken,
              user: { ...deleteObjectByKeys(existUser, ExcludeFields), password: undefined },
            },
            status: {
              code: 201,
              message: "Login successful!",
              success: true,
            },
        }
      }
      else{
        return {
          data: null,
          status: {
            code: 403,
            message: "The code is wrong.",
            success: false,
          },
        };
      }
    }
    else{
      return {
        data: null,
        status: {
          code: 201,
          message: "The account was actived.",
          success: false,
        },
      };
    }
  } catch (error) {
    console.error(error);
    return {
      data: null,
      status: {
        code: 500,
        message: "Internal Server Error",
        success: false,
      },
    };
  }
}

export async function forgotPassword(body :{
  email: string,
  step: number,
  digitnumber?: string,
  password?: string,
  repeatPassword?: string
}
): Promise<ResponseEntry<LoginRes | null>> {
  const User = new UserRepository();
  let sixDigits = Math.floor(100000 + Math.random() * 900000);

  /** Check existed user */
  try {
    const existUser = await User.getOneByEmail(body.email, PROVIDER.SYSTEM);
    if (existUser){
      if(!body.email){
        return {
          data: null,
          status: {
            code: 403,
            message: 'Missing "email" field.',
            success: false,
          },
        };
      }
      if(!body.step){
        return {
          data: null,
          status: {
            code: 403,
            message: 'Missing "step" field.',
            success: false,
          },
        };
      }

      switch(body.step) {
        case 1:{
          let text = fs.readFileSync(path.join(process.env.ROOT_FOLDER, process.env.FOLDER_TEMPLATE, TEMPLATE_FILE_NAMES.FORGOT_PASSWORD), "utf8");
          let template = handlebars.compile(text);  
          let data = {sixDigits: sixDigits.toString().split('')};
          let currentDate = new Date();
          currentDate.setMinutes(currentDate.getMinutes() + 10);
          const updateUser = await User.updateUserInfor(existUser.id, {digit_number: sixDigits.toString(), expired_at: currentDate});
          let mailerRes =  await Mailer.sendMail({
            from: process.env.EMAIL_USERNAME || "",
            to: body.email,
            subject: WEBSITE_NAME + " " + "forgot password", 
            html: template(data)
          });
          break;
        }
        case 2:{
          if(!body.digitnumber){
            return {
              data: null,
              status: {
                code: 403,
                message: 'Missing "digitnumber" field.',
                success: false,
              },
            };
          }
          if(existUser.digit_number === body.digitnumber){
              return {
                data: null,
                status: {
                  code: 201,
                  message: "The code is valid",
                  success: true,
                },
            }
          }
          else{
            return {
              data: null,
              status: {
                code: 403,
                message: "The code is wrong.",
                success: false,
              },
            };
          }
          break;
        }
        case 3:{
          if(!body.digitnumber){
            return {
              data: null,
              status: {
                code: 403,
                message: 'Missing "digitnumber" field.',
                success: false,
              },
            };
          }
          if(!body.password){
            return {
              data: null,
              status: {
                code: 403,
                message: 'Missing "password" field.',
                success: false,
              },
            };
          }
          if(!body.repeatPassword){
            return {
              data: null,
              status: {
                code: 403,
                message: 'Missing "repeatPassword" field.',
                success: false,
              },
            };
          }
          if(existUser.digit_number === body.digitnumber){
            if(body.password !== body.repeatPassword){
              return {
                data: null,
                status: {
                  code: 403,
                  message: 'The password and repeat password should be the same!',
                  success: false,
                },
              };
            }
            const hashPassword = await hash(body.password);
            const updateUser = await User.updateUserInfor(existUser.id, {password: hashPassword});
            return {
              data: null,
              status: {
                code: 201,
                message: "Your password is already updated",
                success: true,
              },
            }
          }
        }
      }

    }
    return {
      data: null,
      status: {
        code: 201,
        message: "The code was sent to your email.",
        success: true,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      status: {
        code: 500,
        message: "Internal Server Error",
        success: false,
      },
    };
  }
}

export async function loginFacebook(
  user: any
): Promise<ResponseEntry<LoginRes | null>> {
  const User = new UserRepository();
  const Role = new RoleRepository();
  try {
    /** Find user */
    let existUser: any = await User.getUserByProvider(user.id, PROVIDER.FACEBOOK);
    if (!existUser){
      const role = await Role.getRole("user");
      const newUser = await User.create({
        username: uuidv4(),
        email: uuidv4() + "@temp.com",
        password: uuidv4(),
        provider: PROVIDER.FACEBOOK,
        confirmed: true,
        blocked: false,
        RoleId: role?.id as number,
        full_name: user.displayName,
        provider_id: user.id
      });
      if (!newUser){
        return {
          data: null,
          status: {
            code: 400,
            message: "Bad request! Can't register user!",
            success: false,
          },
        };
      }
      existUser = newUser;
      existUser = await User.getUserByProvider(newUser.id.toString(), PROVIDER.FACEBOOK);
    }
    else{
      /** Check blocked account */
      if (existUser.blocked)
        return {
          data: null,
          status: {
            code: 404,
            message: "Account was blocked!",
            success: false,
          },
        };
    }

    /** Generate token */
    const {token, refetchToken} = GenerateToken(existUser);
    return {
      data: {
        jwt: token,
        refetchJwt: refetchToken,
        user: { ...existUser, password: undefined },
      },
      status: {
        code: 201,
        message: "Login successful!",
        success: true,
      },
    };

  } catch (error) {
    console.error(error);
    return {
      data: null,
      status: {
        code: 500,
        message: "Internal Server Error",
        success: false,
      },
    };
  }
}

export async function loginGoogle(
  user: any
): Promise<ResponseEntry<LoginRes | null>> {
  const User = new UserRepository();
  const Role = new RoleRepository();
  try {
    /** Find user */
    let existUser = await User.getUserByProvider(user.id, PROVIDER.GOOGLE);
    if (!existUser){
      const role = await Role.getRole("user");
      const newUser = await User.create({
        username: user.email,
        email: user.email,
        password: uuidv4(),
        provider: PROVIDER.GOOGLE,
        confirmed: true,
        blocked: false,
        RoleId: role?.id as number,
        full_name: user.displayName,
        provider_id: user.id
      });
      if (!newUser){
        return {
          data: null,
          status: {
            code: 400,
            message: "Bad request! Can't register user!",
            success: false,
          },
        };
      }
      existUser = await User.getUserByProvider(newUser.id.toString(), PROVIDER.GOOGLE);
      existUser = newUser;
    }
    else{
      /** Check blocked account */
      if (existUser.blocked)
        return {
          data: null,
          status: {
            code: 404,
            message: "Account was blocked!",
            success: false,
          },
        };
    }

    /** Generate token */
    const {token, refetchToken} =  GenerateToken(existUser);
    return {
      data: {
        jwt: token,
        refetchJwt: refetchToken,
        user: { ...existUser, password: undefined },
      },
      status: {
        code: 201,
        message: "Login successful!",
        success: true,
      },
    };

  } catch (error) {
    console.error(error);
    return {
      data: null,
      status: {
        code: 500,
        message: "Internal Server Error",
        success: false,
      },
    };
  }
}

export async function loginPocket(
  access_token: string
): Promise<ResponseEntry<LoginRes | null>> {
  const User = new UserRepository();
  const Role = new RoleRepository();
  
  // verify token
  try{
    const response = await axios.get('https://wallet.datgach.vn/api/mobile/user-profile', {headers:{Authorization: "Bearer " + access_token}, getaxios: true});
    try {
      const user = response.data.user;
      /** Find user */
      let existUser = await User.getUserByProvider(user.id, PROVIDER.POCKET);
      if (!existUser){
        const role = await Role.getRole("user");
        const newUser = await User.create({
          username: user.email,
          email: user.email,
          password: uuidv4(),
          provider: PROVIDER.POCKET,
          confirmed: true,
          blocked: false,
          RoleId: role?.id as number,
          full_name: user.name,
          provider_id: user.id
        });
        if (!newUser){
          return {
            data: null,
            status: {
              code: 400,
              message: "Bad request! Can't register user!",
              success: false,
            },
          };
        }
        existUser = await User.getUserByProvider(newUser.id.toString(), PROVIDER.POCKET);
        existUser = newUser;
      }
      else{
        /** Check blocked account */
        if (existUser.blocked)
          return {
            data: null,
            status: {
              code: 404,
              message: "Account was blocked!",
              success: false,
            },
          };
      }

      /** Generate token */
      const {token, refetchToken} =  GenerateToken(existUser);
      return {
        data: {
          jwt: token,
          refetchJwt: refetchToken,
          user: { ...existUser, password: undefined },
        },
        status: {
          code: 201,
          message: "Login successful!",
          success: true,
        },
      };

    } catch (error) {
      console.error(error);
      return {
        data: null,
        status: {
          code: 500,
          message: "Internal Server Error",
          success: false,
        },
      };
    }
  }catch(error: any){
    return {
      data: null,
      status: {
        code: error.response.status,
        message: error.response.data.status,
        success: false,
      },
    };
  }
}

export async function sendMailContact(
  data: ContactInput
): Promise<ResponseEntry<LoginRes | null>> {
  const Contact = new ContactRepository();
  let text = fs.readFileSync(path.join(process.env.ROOT_FOLDER, process.env.FOLDER_TEMPLATE, TEMPLATE_FILE_NAMES.CONTACT), "utf8");
  let template = handlebars.compile(text);  
  let nDate = new Date();
  data.currentDate = date_format.asString('hh:mm, dd/MM/yyyy', nDate)
  if(!data.email || !data.message){
    return {
      data: null,
      status: {
        code: 406,
        message: "The email and message fields are required",
        success: false,
      },
    };
  }
  let mailerRes =  await Mailer.sendMail({
    from: process.env.EMAIL_USERNAME || "",
    to: data.email,
    subject: WEBSITE_NAME + " " + "contact", 
    html: template(data)
  });
  if(data.notified){
    try{
      await Contact.createContact({email: data.email});
    }catch(error){
      console.error(error);
    }
  }
  
  // data.currentDate = new Date(); 
  return {
    data: null,
    status: {
      code: 201,
      message: "Thank you for sending us an email, we will email you a reply soon.",
      success: true,
    },
  };
}