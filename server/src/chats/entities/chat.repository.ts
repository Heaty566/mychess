import { RepositoryService } from 'src/utils/repository/repository.service';

//---- Service
import { EntityRepository } from 'typeorm';

//---- Service
import { Chat } from './chat.entity';

@EntityRepository(Chat)
export class ChatRepository extends RepositoryService<Chat> {}
