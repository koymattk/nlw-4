import { Request, response, Response } from 'express';
import { resolve } from 'path';
import { getCustomRepository } from "typeorm";
import { SurveysRepository } from '../repositories/SurveysRepository';
import { SurveyUserRepository } from '../repositories/SurveyUserRepository';
import { UserRepository } from "../repositories/UserRepository";
import SendMailService from '../services/SendMailService';

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


        const surveyUserAlreadyExists = await surveyUserRepository.findOne({
            where:[
                {user_id: userAlreadyExists.id}, {value:null}
            ]
        })
        const npsPath = resolve(__dirname, "..","views","emails", "npsMail.hbs");

        const variables = {
            name:userAlreadyExists.name,
            title: surveyAlreadyExists.title,
            description: surveyAlreadyExists.description,
            user_id:userAlreadyExists.id,
            link: process.env.URL_MAIL
        }

        if(surveyUserAlreadyExists){
            await SendMailService.execute(email,surveyAlreadyExists.title,variables, npsPath)
        }

        const surveyUser = surveyUserRepository.create({
            user_id: userAlreadyExists.id,
            survey_id,
        });
        
        await surveyUserRepository.save(surveyUser);
        

        

        await SendMailService.execute(email,surveyAlreadyExists.title,variables, npsPath)

        return res.json(surveyUser);
        
    }

    

}

export { SendMailController };
