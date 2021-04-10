import { RepositoryService } from '../../utils/repository/repository.service';
import { EntityRepository } from 'typeorm';
import { Chat } from './chat.entity';

@EntityRepository(Chat)
export class ChatRepository extends RepositoryService<Chat> {}
