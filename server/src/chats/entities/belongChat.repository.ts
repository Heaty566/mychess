import { RepositoryService } from '../../utils/repository/repository.service';

//---- Service
import { EntityRepository } from 'typeorm';

//---- Entity
import { BelongChat } from './belongChat.entity';

@EntityRepository(BelongChat)
export class BelongChatRepository extends RepositoryService<BelongChat> {}
