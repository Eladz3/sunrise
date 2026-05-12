import type { BaseEntity } from './common.types';

export type Group = BaseEntity & {
  id: number;
  name: string;
  bannerImage: string;
};

export type CreateGroupRequest = {
  name: string;
  bannerImage?: string;
};
