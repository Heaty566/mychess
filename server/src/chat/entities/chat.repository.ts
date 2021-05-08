import { RepositoryService } from '../../utils/repository/repository.service';

//---- Service
import { EntityRepository } from 'typeorm';

//---- Service
import { Chat } from './chat.entity';

@EntityRepository(Chat)
export class ChatRepository extends RepositoryService<Chat> {
      async getOneChatById(id: string) {
            return this.createQueryBuilder('chat')
                  .leftJoinAndSelect('chat.messages', 'message')
                  .leftJoinAndSelect('chat.users', 'user')
                  .select([
                        'chat.id',
                        'chat.createDate',
                        'message.createDate',
                        'message.userId',
                        'message.content',
                        'user.id',
                        'user.name',
                        'user.avatarUrl',
                  ])
                  .where('chat.id = :id', { id })
                  .getOne();
      }
}
