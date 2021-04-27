import { EntityRepository, ObjectLiteral } from 'typeorm';

//---- Entity
import { TicTacToe } from './ticTacToe.entity';

//---- Repository
import { RepositoryService } from '../../utils/repository/repository.service';

@EntityRepository(TicTacToe)
export class TicTacToeRepository extends RepositoryService<TicTacToe> {
      async getManyTTTByField(where: string, parameters: ObjectLiteral) {
            const res = await this.createQueryBuilder('tic').leftJoinAndSelect('tic.users', 'user').where(where, parameters).getMany();

            return res;
      }
      async getOneTTTByFiled(where: string, parameters: ObjectLiteral) {
            const res = await this.createQueryBuilder('tic').leftJoinAndSelect('tic.users', 'user').where(where, parameters).getOne();

            return res;
      }
}