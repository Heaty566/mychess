import { RepositoryService } from "src/repository/repository.service";
import { EntityRepository } from "typeorm";
import { RefreshToken } from "./refreshToken.entity";

@EntityRepository(RefreshToken)
export class RefreshTokenRepository extends RepositoryService<RefreshToken>{ }