import * as Joi from 'joi';

export class SearchUsersDTO {
      currentPage: number;
      name: string;
      pageSize: number;
}

export const vSearchUsersDTO = Joi.object({
      currentPage: Joi.number().failover(0).min(0).required(),
      name: Joi.string().allow('').failover('').required(),
      pageSize: Joi.number().failover(12).min(0).required(),
});
