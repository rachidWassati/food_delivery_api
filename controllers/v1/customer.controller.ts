import { plainToClass } from 'class-transformer';
import {Request, Response, NextFunction} from 'express';
import { CreateCustomerInputs, EditCustomerProfileInputs, UserLoginInputs } from '../../dto/Customer.dto';
import { validate } from 'class-validator';
import { generateOTP, generateSalt, generateSignature, hashPassword, isValidatedPassword, onRequestOTP } from '../../utility';
import { Customer } from '../../models';

export const customerSignup = async (req: Request, res: Response, next: NextFunction) => {
    const customerInputs = plainToClass(CreateCustomerInputs, req.body);
    const inputErrors = await validate(customerInputs, {validationError: {target: true}})
    if(inputErrors.length) {
        return res.status(400).json(inputErrors);
    }

    const {email, phone, password} = customerInputs;

    const salt = await generateSalt();
    const hashedPassword = await hashPassword(password, salt)
    const {otp, otp_expiry} = generateOTP();

    const existingCustomer = await Customer.findOne({ email })

    if(existingCustomer) {
        return res.status(409).json({message: "An user exist with this email"})
    }

    const newCustomer = await Customer.create({
        email, password: hashedPassword, phone, salt, otp, otp_expiry, firstname: '', lastname: '', address: '', verified: false, lat: 0, long: 0
    })

    if(newCustomer) {
        //send the OTP to customer
        await onRequestOTP(otp, phone);

        // generate signature
        const signature = generateSignature({
            _id: newCustomer._id,
            email: newCustomer.email,
            verified: newCustomer.verified
        })

        // send the result to Client Side
        return res.status(201).json({signature, verified: newCustomer.verified, email: newCustomer.email})
    }

    return res.status(400).json({message: "Error with the signup..."})
}

export const customerLogin = async (req: Request, res: Response, next: NextFunction) => {
    const loginInputs = plainToClass(UserLoginInputs, req.body);
    const loginErrors = await validate(loginInputs, {validationError: {target: false}});
    
    if(loginErrors.length) {
        return res.status(400).json(loginErrors);
    }

    const {email, password} = loginInputs;
    const customer = await Customer.findOne({ email })

    if(customer) {
        const validation = await isValidatedPassword(password, customer.password, customer.salt);
        
        if (validation) {
            const signature = generateSignature({
                _id: customer._id,
                email: customer.email,
                verified: customer.verified
            })

            return res.status(201).json({signature, verified: customer.verified, email: customer.email})
        }

    }
    return res.status(404).json({message: "Error with the email and/or password provided."})
}

export const customerVerify = async (req: Request, res: Response, next: NextFunction) => {
    const {otp} = req.body;
    const customer = req.user;

    if(customer) {
        const profile = await Customer.findById(customer._id);
        if(profile) {
            if(profile.otp === parseInt(otp) && profile.otp_expiry >= new Date()) {
                profile.verified = true;
                const updatedCustomer = await profile.save();
                const signature = generateSignature({
                    _id: updatedCustomer._id,
                    email: updatedCustomer.email,
                    verified: updatedCustomer.verified
                })
                return res.status(201).json({ signature, verified: updatedCustomer.verified, email: updatedCustomer.email})
            }
            return res.status(400).json({message: "Error with the OTP provided or the OTP has expired"})
        }
    }

    return res.status(400).json({message: "Error with OTP validation"})
}

export const requestOtp = async (req: Request, res: Response, next: NextFunction) => {
    const customer = req.user;
    if(customer) {
        const profile = await Customer.findById(customer._id);
        if(profile) {
            const {otp, otp_expiry} = generateOTP();

            profile.otp = otp;
            profile.otp_expiry = otp_expiry;

            await profile.save();
            await onRequestOTP(otp, profile.phone);

            res.status(200).json({message: "OTP sent to your registered phone number."});
        }
    }
    return res.status(400).json({message: "Error with Request OTP"});
}

export const getCustomerProfile = async (req: Request, res: Response, next: NextFunction) => {
    const customer = req.user;
    if(customer) {
        const profile = await Customer.findById(customer._id);
        if(profile) {
            return res.status(200).json(profile)
        }
    }
    return res.status(400).json({message: "Error with fetch profile"})
}

export const editCustomerProfile = async (req: Request, res: Response, next: NextFunction) => {
    const customer = req.user;
    const profileInputs = plainToClass(EditCustomerProfileInputs, req.body)
    const profileErrors = await validate(profileInputs, { validationError: {target: false}});

    if (profileErrors.length) {
        return res.status(400).json(profileErrors)
    }

    const {firstname, lastname, address} = profileInputs;

    if(customer) {
        const profile = await Customer.findById(customer._id);
        if(profile) {
            profile.firstname = firstname;
            profile.lastname = lastname;
            profile.address = address;

            const result = await profile.save();

            return res.status(200).json(result);
        }
    }
}