import { EntitySubscriberInterface, EventSubscriber, RemoveEvent, SoftRemoveEvent } from 'typeorm';
import { GroupEntity } from '../../domain/entities/group.entity';
import { GroupMembershipEntity } from '../../domain/entities/group-membership.entity';

@EventSubscriber()
export class GroupGroupMembershipSubscriber implements EntitySubscriberInterface<GroupEntity> {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/explicit-function-return-type
  listenTo() {
    return GroupEntity;
  }

  async beforeSoftRemove(event: SoftRemoveEvent<GroupEntity>): Promise<void> {
    const softRemovedGroup = event.entity;
    const groupMembershipRepository = event.manager.getRepository(GroupMembershipEntity);
    const groupMemberships = await groupMembershipRepository.find({
      relations: ['members'],
      where: {
        group: {
          id: softRemovedGroup?.id,
        },
      },
    });
    if (groupMemberships.length == 0) return;
    for (const groupMembership of groupMemberships) {
      await groupMembershipRepository.softRemove(groupMembership);
    }
  }

  async beforeRemove(event: RemoveEvent<GroupEntity>): Promise<void> {
    const removedGroup = event.entity;
    const groupMembershipRepository = event.manager.getRepository(GroupMembershipEntity);
    const groupMemberships = await groupMembershipRepository.find({
      relations: ['members'],
      where: {
        group: {
          id: removedGroup?.id,
        },
      },
    });
    if (groupMemberships.length == 0) return;
    for (const groupMembership of groupMemberships) {
      await groupMembershipRepository.remove(groupMembership);
    }
  }
}
