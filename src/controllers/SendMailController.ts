import { Request, response, Response } from 'express';
import { getCustomRepository } from "typeorm";
import { SurveyUserRepository } from '../repositories/SurveyUserRepository';
import {SurveysRepository} from '../repositories/SurveysRepository'
import { UserRepository } from "../repositories/UserRepository";
import { SurveyUser } from '../models/SurveyUser';

class SendMailController {

    async execute (req : Request, res: Response) {
        const { email, survey_id } = req.body;
        
        const userRepository = getCustomRepository(UserRepository);
        const surveysRepository = getCustomRepository(SurveysRepository);
        const surveyUserRepository = getCustomRepository(SurveyUserRepository);

        const userAlreadyExists = await userRepository.findOne({email});
        if(!userAlreadyExists){
            return response.status(400).json({
                error: "user does not exits"
            });
        }
        const surveyAlreadyExists =  await surveysRepository.findOne({id: survey_id});
        if(!surveyAlreadyExists){
            return res.status(400).json({
                error: "Survey does not exists!"
            });
        }

        const surveyUser = surveyUserRepository.create({
            user_id: userAlreadyExists.id,
            survey_id,
        });
        await surveyUserRepository.save(surveyUser);

        res.json(surveyUser);
        
    }

}

export { SendMailController };
