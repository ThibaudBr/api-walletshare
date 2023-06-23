import { EntitySubscriberInterface, EventSubscriber, RemoveEvent, Repository, SoftRemoveEvent } from 'typeorm';
import { GroupEntity } from '../../domain/entities/group.entity';
import { GroupMembershipEntity } from '../../domain/entities/group-membership.entity';

@EventSubscriber()
export class GroupGroupMembershipSubscriber implements EntitySubscriberInterface<GroupEntity> {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/explicit-function-return-type
  listenTo() {
    return GroupEntity;
  }

  async beforeSoftRemove(event: SoftRemoveEvent<GroupEntity>): Promise<void> {
    const softRemovedGroup: GroupEntity | undefined = event.entity;
    const groupMembershipRepository: Repository<GroupMembershipEntity> =
      event.manager.getRepository(GroupMembershipEntity);
    const groupMemberships: GroupMembershipEntity[] = await groupMembershipRepository.find({
      relations: ['group'],
      where: {
        group: {
          id: softRemovedGroup?.id,
        },
      },
    });
    if (groupMemberships.length == 0) return;
    await groupMembershipRepository.softRemove(groupMemberships).catch(async error => {
      console.log(error);
    });
  }

  async beforeRemove(event: RemoveEvent<GroupEntity>): Promise<void> {
    const removedGroup: GroupEntity | undefined = event.entity;
    const groupMembershipRepository: Repository<GroupMembershipEntity> =
      event.manager.getRepository(GroupMembershipEntity);
    const groupMemberships: GroupMembershipEntity[] = await groupMembershipRepository.find({
      relations: ['group'],
      withDeleted: true,
      where: {
        group: {
          id: removedGroup?.id,
        },
      },
    });
    if (groupMemberships.length == 0) return;
    await groupMembershipRepository.remove(groupMemberships).catch(async error => {
      console.log(error);
    });
  }
}
