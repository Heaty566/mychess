import { RepositoryService } from 'src/utils/repository/repository.service';

//---- Service
import { EntityRepository } from 'typeorm';

//---- Entity
import { BelongChat } from './belongChat.entity';

@EntityRepository()
export class BelongChatRepository extends RepositoryService<BelongChat> {}
